import { supabase } from "#shared/supabase/supabase-client.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { z } from "zod";
import { nanoid } from "nanoid";
import type { createCoverImageSchema } from "@repo/types/schemas/user/create-cover-image-schema";

async function uploadCoverImage(f: File, nickname: string) {
  const id = nanoid(3);

  return await supabase.storage.from("user_images").upload(`cover/${nickname}-${id}.png`, f);
}

async function createCoverImage({
  type, file, nickname
}: z.infer<typeof createCoverImageSchema> & {
  nickname: string;
}) {
  switch (type) {
    case "custom":
      if (!file) {
        throw new Error("File is required");
      }

      await uploadCoverImage(file, nickname);
      break;
    case "default":

      break;
    default:
      throw new Error("Invalid type");
  }
}

export const createCoverImageRoute = new Hono()
  .post("/create-cover-image", async (ctx) => {
    const body = await ctx.req.parseBody();
    const file = body['file'] as File;
    const type = body['type'] as z.infer<typeof createCoverImageSchema>["type"]

    const nickname = getNickname()

    try {
      const res = await createCoverImage({ type, file, nickname });

      return ctx.json({ status: "Created" }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })