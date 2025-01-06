import { throwError } from "#helpers/throw-error.ts";
import { Hono } from "hono";

export const getThreadImagesRoute = new Hono()
.get("/get-thread-images/:threadId", async (ctx) => {
  const { threadId } = ctx.req.param();


  try {
    return ctx.json([], 200)
  } catch (e) {
    return ctx.json({ error: throwError(e) }, 500);
  }
})