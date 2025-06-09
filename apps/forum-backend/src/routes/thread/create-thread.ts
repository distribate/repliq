import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { Hono } from "hono";
import { z } from "zod/v4";
import { createThreadSchema } from "@repo/types/schemas/thread/create-thread-schema";
import { decode } from "cbor-x";
import type { CreateThreadResponse } from "@repo/types/routes-types/create-thread-types";
import { createThread } from '#lib/queries/thread/create-thread.ts';
import { validateThreadsTimeout } from '#lib/validators/validate-threads-timeout.ts';
import { validateThreadImagesLength } from '#lib/validators/validate-thread-images-length.ts';

export const createThreadRoute = new Hono()
  .post("/create-thread", async (ctx) => {
    const nickname = getNickname()
    const isValid = await validateThreadsTimeout(nickname)

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