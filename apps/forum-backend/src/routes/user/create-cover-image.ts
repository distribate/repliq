import { supabase } from "#shared/supabase/supabase-client.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { z } from "zod/v4";
import { nanoid } from "nanoid";
import { decode } from "cbor-x";
import { forumDB } from "#shared/database/forum-db.ts";
import { createCoverImageSchema } from "@repo/types/schemas/user/create-cover-image-schema.ts"
import { getPublicUrl } from "#utils/get-public-url.ts";
import { USER_IMAGES_BUCKET } from "@repo/shared/constants/buckets";

async function deletePrevCoverImage(nickname: string) {
  const query = await forumDB
    .selectFrom("users")
    .select("cover_image")
    .where("nickname", "=", nickname)
    .executeTakeFirst()

  if (query && query.cover_image && query.cover_image.startsWith("cover")) {
    return await supabase.storage.from(USER_IMAGES_BUCKET).remove([query.cover_image])
  }
  
  return;
}

async function uploadCustomCoverImage(f: File, nickname: string) {
  return await forumDB.transaction().execute(async (trx) => {
    const id = nanoid(3);

    const fileName = `${nickname}-${id}.png`;

    await supabase.storage.from(USER_IMAGES_BUCKET).upload(`cover/${fileName}`, f);

    const { cover_image } = await trx
      .updateTable("users")
      .set({ cover_image: `cover/${fileName}` })
      .where("nickname", "=", nickname)
      .returning("cover_image")
      .executeTakeFirstOrThrow()

    return { cover_image }
  })
}

async function uploadDefaultCoverImage(fileName: string, nickname: string) {
  const q = await forumDB
    .updateTable("users")
    .set({ cover_image: `default/${fileName}` })
    .where("nickname", "=", nickname)
    .returning("cover_image")
    .executeTakeFirstOrThrow()

  return { cover_image: q.cover_image }
}

type CreateCoverImage = Omit<z.infer<typeof createCoverImageSchema>, "file"> & {
  file: File | null;
  nickname: string;
}

async function createCoverImage({
  type, nickname, file, fileName
}: CreateCoverImage) {
  switch (type) {
    case "custom":
      if (!file) {
        throw new Error("File is required");
      }

      await deletePrevCoverImage(nickname)

      return await uploadCustomCoverImage(file, nickname);
    case "default":
      if (!fileName) {
        throw new Error("Filename is required");
      }

      await deletePrevCoverImage(nickname)

      return await uploadDefaultCoverImage(fileName, nickname);
    default:
      throw new Error("Invalid type");
  }
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
      const res = await createCoverImage({ type, file: cf, fileName, nickname });

      if (!res.cover_image) {
        return ctx.json({ error: "Error creating cover image" }, 400)
      }

      const url = getPublicUrl(USER_IMAGES_BUCKET, res.cover_image)

      return ctx.json({ data: url, status: "Success" }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })