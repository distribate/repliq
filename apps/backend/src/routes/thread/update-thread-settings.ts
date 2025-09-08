import { throwError } from '#utils/throw-error.ts';
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { updateThreadSchema } from "@repo/types/schemas/thread/update-thread-schema.ts";

export const updateThreadSettingsRoute = new Hono()
  .post("/update-settings", zValidator("json", updateThreadSchema), async (ctx) => {
    const result = updateThreadSchema.parse(ctx.req.valid("json"));

    try {
      // todo

      const data = {
        status: "Thread settings updated"
      }

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400)
    }
  })