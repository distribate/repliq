import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { Hono } from "hono";
import { z } from "zod";
import { createThreadSchema } from "@repo/types/schemas/thread/create-thread-schema";
import { decode } from "cbor-x";
import type { CreateThreadResponse } from "@repo/types/routes-types/create-thread-types";
import { createThread } from '#lib/queries/thread/create-thread.ts';
import { forumDB } from '#shared/database/forum-db.ts';
import { getUserDonate } from '#lib/queries/user/get-user-donate.ts';

const DEFAULT_MAX_THREADS_PER_DAY = 3

async function validateThreadCooldown(nickname: string) {
  const threeDayAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

  const result = await forumDB
    .selectFrom("threads_users")
    .select([
      forumDB.fn
        .countAll()
        .as("postsPerThreeDay"),
    ])
    // @ts-ignore
    .where("created_at", ">", threeDayAgo.toISOString())
    .where("user_nickname", "=", nickname)
    .$narrowType<{ postsPerThreeDay: number }>()
    .executeTakeFirstOrThrow();

  const { postsPerThreeDay } = result

  if (postsPerThreeDay >= DEFAULT_MAX_THREADS_PER_DAY) {
    return "timeout"
  }

  return null
}

const validateThreadImagesLength = async (nickname: string, images: File[]) => {
  const { donate } = await getUserDonate(nickname)

  if (images.length <= 2) {
    return images
  } else if (images.length > 2) {
    if (donate === "default") {
      return images.slice(0, 2)
    }
  }

  return images.slice(0, 3)
}

export const createThreadRoute = new Hono()
  .post("/create-thread", async (ctx) => {
    const nickname = getNickname()
    const isValid = await validateThreadCooldown(nickname)

    if (isValid === "timeout") {
      return ctx.json<CreateThreadResponse>({ error: "You have reached the limit of threads per day" }, 429);
    }

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

    const { images: raw } = result.data

    let images = raw ? raw.map((ib, idx) => {
      const { title } = result.data;

      const fileName = `${title}_${idx}.png`;

      return new File([ib], fileName, { type: "image/png" });
    }) : null;

    if (images) {
      images = await validateThreadImagesLength(nickname, images as File[])
    }

    try {
      const createdThread = await createThread({ ...result.data, nickname, images: images as File[] });

      if (!createdThread) {
        return ctx.json<CreateThreadResponse>({ error: "Error" }, 400);
      }

      return ctx.json<CreateThreadResponse>({ status: "Created", data: { id: createdThread.thread_id } }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })