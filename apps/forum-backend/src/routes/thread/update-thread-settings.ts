import { throwError } from "#helpers/throw-error.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { updateThreadSchema } from "@repo/types/schemas/thread/update-thread-schema.ts";

export const updateThreadSettingsRoute = new Hono()
  .post("/update-thread-settings", zValidator("json", updateThreadSchema), async (ctx) => {
    const body = ctx.req.valid("json");
    const result = updateThreadSchema.parse(body);

    try {
      // todo

      return ctx.json({ status: "Thread settings updated" }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 400)
    }
  })