import { throwError } from "#helpers/throw-error.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const updateThreadSettingsSchema = z.object({
  threadId: z.string(),
  new_title: z.string().optional(),
  new_description: z.string().optional().nullable(),
  new_tags: z.string().optional(),
  is_comments: z.string().transform((val) => val === "true").optional(),
})

export const updateThreadSettingsRoute = new Hono()
  .post("/update-thread-settings", zValidator("json", updateThreadSettingsSchema), async (ctx) => {
    const body = ctx.req.valid("json");
    const result = updateThreadSettingsSchema.parse(body);

    console.log(result)

    try {
      return ctx.json({ status: "Thread settings updated" }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400)
    }
  })