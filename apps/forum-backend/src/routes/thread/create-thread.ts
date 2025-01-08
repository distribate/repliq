import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { Hono } from "hono";
import { z } from "zod";
import { createThreadSchema } from "@repo/types/schemas/thread/create-thread-schema";
import { decode } from "cbor-x";
import type { CreateThreadResponse } from "@repo/types/routes-types/create-thread-types";
import { createThread } from '#lib/queries/thread/create-thread.ts';

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