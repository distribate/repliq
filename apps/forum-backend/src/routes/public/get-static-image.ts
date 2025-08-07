import { getPublicUrl } from "#utils/get-public-url.ts";
import { zValidator } from "@hono/zod-validator";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import * as z from "zod";

const getStaticImageSchema = z.object({
  bucket: z.string(),
  fileName: z.string(),
})

export const getStaticImageRoute = new Hono()
  .get("/get-static-image", zValidator("query", getStaticImageSchema), async (ctx) => {
    const { bucket, fileName } = getStaticImageSchema.parse(ctx.req.query());

    try {
      const imageUrl = getPublicUrl(bucket, fileName)

      return ctx.json({ data: imageUrl }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })