import { throwError } from "#helpers/throw-error.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import { supabase } from "#shared/supabase/supabase-client.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { Hono } from "hono";
import { sql, Transaction } from "kysely";
import { z } from "zod";
import { createThreadSchema } from "@repo/types/schemas/thread/create-thread-schema";
import { JsonValue } from "#helpers/json-value.ts";
import type { DB as forumDBType } from "@repo/types/db/forum-database-types";
import { decode } from "cbor-x";
import type { CreateThreadResponse } from "@repo/types/routes-types/create-thread-types";

type CreateThread = Omit<z.infer<typeof createThreadSchema>, "images"> & {
  nickname: string
  images: File[] | null
}

type CreateThreadTransaction = {
  trx: Transaction<forumDBType>
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
  return await trx
    .insertInto("threads_images")
    .values({ thread_id, images })
    .execute()
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
    .values({ thread_id, tags: sql`CAST(${tags} AS JSONB[])` })
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

async function createThread({
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

export const createThreadRoute = new Hono()
  .post("/create-thread", async (ctx) => {
    const binaryData = new Uint8Array(await ctx.req.arrayBuffer());

    let decodedData: z.infer<typeof createThreadSchema>;

    try {
      decodedData = decode(binaryData);
    } catch (e) {
      return ctx.json<CreateThreadResponse>({ error: "Invalid data structure" }, 400);
    }

    const result = createThreadSchema.safeParse(decodedData);

    if (!result.success) {
      return ctx.json<CreateThreadResponse>({ error: JSON.parse(result.error.message) }, 400);
    }

    const nickname = getNickname()

    if (!nickname) {
      return ctx.json<CreateThreadResponse>({ error: "User not found" }, 400);
    }

    const { images } = result.data

    const files = images ? images.map((ib, idx) => {
      const { title } = result.data;

      const fileName = `${title}_${idx}.png`;

      return new File([ib], fileName, { type: "image/png" });
    }) : null;

    try {
      const createdThread = await createThread({
        ...result.data,
        nickname,
        images: files as File[] | null
      });

      if (!createdThread) {
        return ctx.json<CreateThreadResponse>({ error: "Error" }, 400);
      }

      return ctx.json<CreateThreadResponse>({
        status: "Created",
        data: {
          id: createdThread.thread_id
        }
      }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })