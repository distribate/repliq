import { throwError } from "#utils/throw-error.ts";
import { Hono } from "hono";

export const addImagesThreadRoute = new Hono()
  .post("/add-images-thread/:id", async (ctx) => {
    const id = ctx.req.param("id");

    try {

    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })