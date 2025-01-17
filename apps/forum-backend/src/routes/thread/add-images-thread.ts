import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

export const addImagesThreadRoute = new Hono()
  .post("/add-images-thread/:id", async (ctx) => {
    const { id } = ctx.req.param();

    try {

    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })