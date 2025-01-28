import { zValidator } from "@hono/zod-validator";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { getNewsSchema } from "@repo/types/schemas/news/get-news-schema.ts";
import { getNews } from "#lib/queries/public/get-news.ts";

export const getNewsRoute = new Hono()
  .get("/get-news", zValidator("query", getNewsSchema), async (ctx) => {
    const result = getNewsSchema.parse(ctx.req.query());

    try {
      const news = await getNews(result);

      return ctx.json(news, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })