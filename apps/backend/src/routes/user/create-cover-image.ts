import * as z from "zod";
import { supabase } from "#shared/supabase/supabase-client.ts";
import { getNickname } from "#lib/modules/context.ts";
import { throwError } from "#utils/throw-error.ts";
import { Hono } from "hono";
import { nanoid } from "nanoid";
import { decode } from "cbor-x";
import { forumDB } from "#shared/database/forum-db.ts";
import { createCoverImageSchema } from "@repo/types/schemas/user/create-cover-image-schema.ts"
import { USER_IMAGES_BUCKET } from "@repo/shared/constants/buckets";
import { logger } from "@repo/shared/utils/logger.ts";
import { KONG_PREFIX_URL } from "./create-avatar";
import type { Transaction } from "kysely";
import type { DB } from "@repo/types/db/forum-database-types";

type Schema = z.infer<typeof createCoverImageSchema>

type CreateCoverImage = Omit<Schema, "file"> & {
  file: File | null;
}

const ROOT_COVER_PATH = "user_images"
const CUSTOM_PATH = "cover"
const DEFAULT_PATH = "default"

export function getUserImageType(url: string): "custom" | "default" {
  if (url.includes("/user_images/cover/")) {
    return "custom";
  }
  if (url.includes("/user_images/default/")) {
    return "default";
  }
  throw new Error(`Unknown user image type for URL: ${url}`);
}

export async function deletePrevCoverImage(
  nickname: string,
  trx: Transaction<DB>
): Promise<boolean | void> {
  const exists = await trx
    .selectFrom("users")
    .select("cover_image")
    .where("nickname", "=", nickname)
    .executeTakeFirst()

  if (exists && exists.cover_image) {
    const url = exists.cover_image

    const type = getUserImageType(url)

    if (type === 'custom') {
      const prefix = `/public/${ROOT_COVER_PATH}/`;
      const index = url.indexOf(prefix);
      const target = url.slice(index + prefix.length);
      
      const result = await supabase
        .storage
        .from(USER_IMAGES_BUCKET)
        .remove([target])

      if (result.error) {
        logger.error(result.error);
        throw new Error(result.error.message)
      }

      return result.data.length >= 1
    }

    const query = await trx
      .updateTable("users")
      .set({ cover_image: null })
      .where("nickname", "=", nickname)
      .executeTakeFirst()

    if (!query.numUpdatedRows) {
      throw new Error("Not changed")
    }

    return true
  }
}

async function createCoverImage(
  nickname: string,
  { type, file, fileName }: CreateCoverImage
): Promise<string> {
  if (type === 'custom') {
    if (!file) throw new Error("File is required");

    return forumDB.transaction().execute(async (trx) => {
      const deleted = await deletePrevCoverImage(nickname, trx)

      const id = nanoid(3);
      const fileName = `${CUSTOM_PATH}/${nickname}-${id}.png`;

      async function rollback() {
        const result = await supabase
          .storage
          .from(USER_IMAGES_BUCKET)
          .remove([fileName]);

        if (result.error) {
          throw new Error(result.error.message)
        }
      }

      const result = await supabase
        .storage
        .from(USER_IMAGES_BUCKET)
        .upload(fileName, file);

      if (result.error) {
        throw new Error(result.error.message)
      }

      const newUrl = `${KONG_PREFIX_URL}/public/${result.data.fullPath}`

      const query = await trx
        .updateTable("users")
        .set({ cover_image: newUrl })
        .where("nickname", "=", nickname)
        .executeTakeFirstOrThrow()

      if (!query.numUpdatedRows) {
        await rollback()
        throw new Error("Not changed")
      }

      return newUrl
    })
  }

  if (type === 'default') {
    if (!fileName) throw new Error("Filename is required");

    return forumDB.transaction().execute(async (trx) => {
      const deleted = await deletePrevCoverImage(nickname, trx)

      const newUrl = `${KONG_PREFIX_URL}/public/${ROOT_COVER_PATH}/${DEFAULT_PATH}/${fileName}`

      const query = await trx
        .updateTable("users")
        .set({ cover_image: newUrl })
        .where("nickname", "=", nickname)
        .executeTakeFirstOrThrow()

      if (!query.numUpdatedRows) {
        throw new Error("Not changed")
      }

      return newUrl
    })
  }

  throw new Error("Type is not defined")
}

const MAX_FILE_SIZE = 4; // MB
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE * 1024 * 1024;

export const createCoverImageRoute = new Hono()
  .post("/create", async (ctx) => {
    const nickname = getNickname()
    const body = new Uint8Array(await ctx.req.arrayBuffer());

    let decodedData: z.infer<typeof createCoverImageSchema>;

    try {
      decodedData = decode(body);
    } catch (e) {
      return ctx.json({ error: "Invalid data structure" }, 400);
    }

    const { success, error, data } = createCoverImageSchema.safeParse(decodedData);

    if (!success) {
      return ctx.json({ error: error.message }, 400);
    }

    const { type, file: raw, fileName } = data;

    let coverImageFile: globalThis.File | null = null;

    if (raw) {
      if (raw.length > MAX_FILE_SIZE_BYTES) {
        return ctx.json({ error: `File size exceeds ${MAX_FILE_SIZE} MB` }, 400);
      }

       // @ts-ignore
      coverImageFile = new globalThis.File([raw], "cover.png", { type: "image/png" })
    }

    try {
      const url = await createCoverImage(nickname, { type, file: coverImageFile, fileName });

      const data = {
        url,
        status: "Success" 
      }

      return ctx.json({ data }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })