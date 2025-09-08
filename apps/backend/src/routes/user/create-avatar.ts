import type { DB } from "@repo/types/db/forum-database-types";
import { forumDB } from "#shared/database/forum-db.ts";
import { supabase } from "#shared/supabase/supabase-client.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { throwError } from "#utils/throw-error.ts";
import { logger } from "@repo/shared/utils/logger.ts";
import { Hono } from "hono";
import { sql, Transaction } from "kysely";
import { nanoid } from "nanoid";

const AVATAR_FILE_SIZE_LIMIT = 2 // MB
const AVATARS_PER_USER = 5

function getAvatarFilename(target: string, file: globalThis.File) {
  const id = nanoid(3)
  const extension = file.name.includes('.') ? `.${file.name.split('.').pop()}` : '';
  const fileName = `${target}-${id}${extension}`
  return { fileName, extension }
}

async function uploadFile(
  bucket: string,
  meta: { fileName: string, extension: string },
  file: globalThis.File
) {
  const res = await supabase
    .storage
    .from(bucket)
    .upload(meta.fileName, file, { contentType: meta.extension, upsert: true })

  if (res.error) {
    logger.error(res.error)
    throw new Error(res.error.message)
  }

  return res.data
}

async function validateAvatarsLength(nickname: string, trx: Transaction<DB>) {
  const existsLength = await trx
    .selectFrom("users")
    .select("avatars")
    .where('nickname', "=", nickname)
    .executeTakeFirstOrThrow()

  if (existsLength.avatars.length >= AVATARS_PER_USER) {
    throw new Error("Avatars limit")
  }
}

export async function deleteAvatar(
  nickname: string,
  id: number
) {
  const { avatar, avatars } = await forumDB
    .selectFrom("users")
    .select(["avatar", "avatars"])
    .where("nickname", "=", nickname)
    .executeTakeFirstOrThrow();

  if (id < 0 || id >= avatars.length) {
    throw new Error("Invalid avatar id");
  }

  const target = avatars[id];

  const updatedAvatars = avatars.filter((ex, i) => i !== id);

  const updatedLastAvatar = updatedAvatars.length > 0 ? updatedAvatars[updatedAvatars.length - 1] : null;

  if (updatedLastAvatar) {
    const url = target;
    const prefix = '/public/';
    const index = url.indexOf(prefix);

    if (index === -1) {
      throw new Error("Url format unexpected");
    }

    const path = url.slice(index + prefix.length);

    const filename = path.split('/').pop();

    if (!filename) throw new Error("Filename extraction failed");

    const result = await supabase.storage.from("users_avatar").remove([filename]);

    if (result.error) {
      throw new Error(result.error.message);
    }
  }

  const update = await forumDB
    .updateTable("users")
    .set({
      avatars: updatedAvatars,
      avatar: updatedLastAvatar
    })
    .where("nickname", "=", nickname)
    .returning(["avatar", "avatars"])
    .executeTakeFirst()

  if (!update) {
    throw new Error()
  }

  return update;
}

export const KONG_PREFIX_URL = `https://kong.fasberry.su/storage/v1/object`

async function createAvatar(
  nickname: string,
  file: globalThis.File
): Promise<string> {
  return forumDB.transaction().execute(async (trx) => {
    await validateAvatarsLength(nickname, trx);

    const { extension, fileName } = getAvatarFilename(nickname, file);

    const result = await uploadFile("users_avatar", { fileName, extension }, file)

    const newUrl = `${KONG_PREFIX_URL}/public/${result.fullPath}`

    const update = await trx
      .updateTable("users")
      .set({
        avatar: newUrl,
        avatars: sql`array_append(avatars, ${newUrl})`
      })
      .where("nickname", "=", nickname)
      .where(sql<boolean>`array_length(avatars, 1) < 5`)
      .executeTakeFirst()

    if (!update) {
      throw new Error('User can have only 5 avatars');
    }

    return newUrl
  })
}

export const createAvatarRoute = new Hono()
  .post("/create", async (ctx) => {
    const initiator = getNickname()

    let inputFile: globalThis.File;

    const requestBody = await ctx.req.formData();
    // @ts-ignore
    const file = requestBody.get("file") as File

    if (!(file instanceof File)) {
      return ctx.json({ error: "Avatar file not provided or invalid format" }, 400);
    }

    if (!file) {
      return ctx.json({ error: "Invalid file type" }, 402)
    }

    inputFile = file as File

    function validateFileSize(file: globalThis.File): boolean {
      return file.size <= AVATAR_FILE_SIZE_LIMIT * 1024 * 1024;
    }

    const isValid = validateFileSize(inputFile)

    if (!isValid) {
      if (inputFile.size === 0) {
        return ctx.json({ error: "File is empty" }, 400);
      }

      return ctx.json({ error: `File size exceeds the limit of ${AVATAR_FILE_SIZE_LIMIT}MB` }, 413);
    }

    try {
      const url = await createAvatar(initiator, inputFile)

      const data = {
        url
      }

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })