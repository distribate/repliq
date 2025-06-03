import { forumDB } from "#shared/database/forum-db.ts";
import { supabase } from "#shared/supabase/supabase-client.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { getPublicUrl } from "#utils/get-public-url.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { logger } from "@repo/lib/utils/logger";
import { decode } from "cbor-x";
import { Hono } from "hono";
import { nanoid } from "nanoid";

const AVATAR_FILE_SIZE_LIMIT = 8 // in MB

async function uploadFile(target: string, file: globalThis.File) {
  const id = nanoid(3)
  const fileExtension = file.name.includes('.') ? `.${file.name.split('.').pop()}` : '';
  const fileName = `${target}-${id}${fileExtension}`

  const res = await supabase.storage.from("users_avatar").upload(fileName, file, { contentType: fileExtension, upsert: true })

  if (res.error) {
    logger.error(res.error.message)
    throw res.error
  }

  return res.data
}

async function createAvatar({ nickname, file }: { nickname: string, file: globalThis.File }) {
  const query = await forumDB.transaction().execute(async (trx) => {
    const uploaded = await uploadFile(nickname, file)

    logger.info(uploaded)

    const update = await trx
      .updateTable("users")
      .set({ avatar: uploaded.path })
      .where("nickname", "=", nickname)
      .returning("avatar")
      .executeTakeFirst()

    if (!update || !update?.avatar) return;

    return { data: update.avatar }
  })

  return query;
}

export const uploadAvatarRoute = new Hono()
  .post("/upload-avatar", async (ctx) => {
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
      const createdAvatar = await createAvatar({ nickname: initiator, file: inputFile })

      if (!createdAvatar?.data) {
        return ctx.json({ error: "Uploading avatar error" }, 401)
      }

      const fullUrl = getPublicUrl("users_avatar", createdAvatar.data)

      return ctx.json({ data: fullUrl, status: "Success" }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })