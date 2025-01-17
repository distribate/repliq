import { JsonValue } from "#helpers/json-value.ts"
import { supabase } from "#shared/supabase/supabase-client.ts"
import type { Transaction } from "kysely"
import type { DB } from "@repo/types/db/forum-database-types";
import type { z } from "zod";
import type { createThreadSchema } from "@repo/types/schemas/thread/create-thread-schema";
import { forumDB } from "#shared/database/forum-db.ts";

type CreateThread = Omit<z.infer<typeof createThreadSchema>, "images"> & {
  nickname: string
  images: File[] | null
}

type CreateThreadTransaction = {
  trx: Transaction<DB>
}

type CreateThreadItem = Omit<CreateThread, "images" | "tags" | "content">
  & CreateThreadTransaction & {
    content: JsonValue<string>
  }

type AddTagsToThread = CreateThreadTransaction & {
  thread_id: string
  tags: string[]
}

type AddThreadUser = CreateThreadTransaction & {
  user_nickname: string
  thread_id: string
}

type UploadThreadImages = {
  thread_id: string
  images: File[]
}

type AddThreadsImages = CreateThreadTransaction & Pick<UploadThreadImages, "thread_id"> & {
  images: string[]
}

async function addThreadsImages({
  images, thread_id, trx
}: AddThreadsImages) {
  if (images.length === 0) return;

  await trx
    .insertInto("threads_images")
    .values(images.map(image => ({ thread_id, image_url: image })))
    .execute();
}

async function uploadThreadImages({
  images, thread_id
}: UploadThreadImages) {
  const uploadPromises = images.map((image, index) => {
    const imageName = `${thread_id}-${index}`;

    return supabase.storage.from("threads").upload(`/${imageName}`, image, {
      cacheControl: "3600", upsert: false,
    });
  });

  return await Promise.all(uploadPromises);
}

async function addTagsToThread({
  tags, thread_id, trx
}: AddTagsToThread) {
  return await trx
    .insertInto("threads_tags")
    .values({ thread_id, tags })
    .returning("id")
    .execute()
}

async function createThreadItem({
  title, content, category_id, description,
  visibility, permission, is_comments, trx
}: CreateThreadItem) {
  const query = await trx
    .insertInto("threads")
    .values({
      title, category_id, description,
      visibility, permission, is_comments, content
    })
    .returning("id")
    .executeTakeFirstOrThrow()

  return query.id
}

async function addThreadUser({
  thread_id, trx, user_nickname
}: AddThreadUser) {
  return await trx
    .insertInto("threads_users")
    .values({ thread_id, user_nickname })
    .executeTakeFirstOrThrow()
}

export async function createThread({
  title, content: rawContent, category_id, tags, visibility,
  permission, description, is_comments, nickname, images
}: CreateThread) {
  const parsedContent = JSON.parse(rawContent);
  const content = new JsonValue(parsedContent)

  return await forumDB.transaction().execute(async (trx) => {
    const thread_id = await createThreadItem({
      title, content, category_id, description,
      visibility, permission, is_comments, trx,
      nickname
    })

    if (tags) {
      await addTagsToThread({ tags, thread_id, trx })
    }

    if (images && images.length > 0) {
      const paths = await uploadThreadImages({
        images: images as File[], thread_id
      })

      await addThreadsImages({ images: paths.map(item => item.data!.path), thread_id, trx });
    }

    await addThreadUser({ thread_id, trx, user_nickname: nickname })

    return { thread_id }
  })
}
