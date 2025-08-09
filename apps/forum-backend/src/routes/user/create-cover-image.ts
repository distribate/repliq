import * as z from "zod";
import { supabase } from "#shared/supabase/supabase-client.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { nanoid } from "nanoid";
import { decode } from "cbor-x";
import { forumDB } from "#shared/database/forum-db.ts";
import { createCoverImageSchema } from "@repo/types/schemas/user/create-cover-image-schema.ts"
import { USER_IMAGES_BUCKET } from "@repo/shared/constants/buckets";
import { logger } from "@repo/lib/utils/logger";
import { KONG_PREFIX_URL } from "./upload-avatar";

export async function deleteCoverImage(nickname: string) {
  const query = await forumDB
    .selectFrom("users")
    .select("cover_image")
    .where("nickname", "=", nickname)
    .executeTakeFirst()

  if (!query || !query.cover_image) {
    return
  }

  const url = query.cover_image

  const prefix = '/public/user_images/';
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

  return result.data
}

async function uploadCustomCoverImage(file: File, nickname: string): Promise<string | null> {
  return forumDB.transaction().execute(async (trx) => {
    const id = nanoid(3);
    const fileName = `${nickname}-${id}.png`;

    const result = await supabase
      .storage
      .from(USER_IMAGES_BUCKET)
      .upload(`cover/${fileName}`, file);

    if (result.error) {
      throw new Error(result.error.message)
    }

    const newUrl = `${KONG_PREFIX_URL}/public/${result.data.fullPath}`

    const { cover_image } = await trx
      .updateTable("users")
      .set({ cover_image: newUrl })
      .where("nickname", "=", nickname)
      .returning("cover_image")
      .executeTakeFirstOrThrow()

    return cover_image
  })
}

async function uploadDefaultCoverImage(fileName: string, nickname: string) {
  const newUrl = `${KONG_PREFIX_URL}/public/user_images/default/${fileName}`

  const { cover_image } = await forumDB
    .updateTable("users")
    .set({ cover_image: newUrl })
    .where("nickname", "=", nickname)
    .returning("cover_image")
    .executeTakeFirstOrThrow()

  return cover_image
}

type CreateCoverImage = Omit<z.infer<typeof createCoverImageSchema>, "file"> & {
  file: File | null;
  nickname: string;
}

async function createCoverImage({ type, nickname, file, fileName }: CreateCoverImage): Promise<string | null> {
  if (type === 'custom') {
    if (!file) {
      throw new Error("File is required");
    }

    const deleted = await deleteCoverImage(nickname)
    console.log(`Deleted prev cover image for ${nickname}`, deleted)

    return uploadCustomCoverImage(file, nickname);
  }

  if (type === 'default') {
    if (!fileName) {
      throw new Error("Filename is required");
    }

    const deleted = await deleteCoverImage(nickname)
    console.log(`Deleted prev cover image for ${nickname}`, deleted)

    return uploadDefaultCoverImage(fileName, nickname);
  }

  throw new Error("Type is not defined")
}

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB

export const createCoverImageRoute = new Hono()
  .post("/create-cover-image", async (ctx) => {
    const nickname = getNickname()
    const bd = new Uint8Array(await ctx.req.arrayBuffer());

    let dd: z.infer<typeof createCoverImageSchema>;

    try {
      dd = decode(bd);
    } catch (e) {
      return ctx.json({ error: "Invalid data structure" }, 400);
    }

    const { success, error, data } = createCoverImageSchema.safeParse(dd);

    if (!success) {
      return ctx.json({ error: error.message }, 400);
    }

    const { type, file: raw, fileName } = data;

    let cf: globalThis.File | null = null;

    if (raw) {
      if (raw.length > MAX_FILE_SIZE) {
        return ctx.json({ error: "File size exceeds 4 MB" }, 400);
      }

      // @ts-ignore
      cf = new globalThis.File([raw], "cover.png", { type: "image/png" })
    }

    try {
      const data = await createCoverImage({ type, file: cf, fileName, nickname });

      return ctx.json({ data, status: "Success" }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })