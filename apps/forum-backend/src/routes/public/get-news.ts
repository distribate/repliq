import { zValidator } from "@hono/zod-validator";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { sqliteDB } from "#shared/database/sqlite-db.ts";
import { getPublicUrl } from "#utils/get-public-url.ts";
import { STATIC_IMAGES_BUCKET } from "@repo/shared/constants/buckets";
import { getNewsSchema } from "@repo/types/schemas/news/get-news-schema";
import { executeWithCursorPagination } from "kysely-paginate";
import * as z from "zod";

type GetNews = z.infer<typeof getNewsSchema>;

async function getNews({ ascending, cursor, limit = 2, searchQuery }: GetNews) {
  let query = sqliteDB
    .selectFrom("news")
    .select(["id", "title", "description", "imageUrl", "created_at"])
    .limit(limit)

  if (searchQuery) {
    query = query.where("title", "like", `%${searchQuery}%`)
  }

  const res = await executeWithCursorPagination(query, {
    perPage: limit,
    after: cursor,
    fields: [
      {
        key: "created_at",
        direction: ascending ? "asc" : "desc",
        expression: "created_at",
      }
    ],
    // @ts-expect-error
    parseCursor: (cursor) => {
      return {
        created_at: new Date(cursor.created_at),
      }
    },
  })

  const news = res.rows.map((news) => ({
    ...news,
    created_at: news.created_at.toString(),
    imageUrl: news.imageUrl ? getPublicUrl(STATIC_IMAGES_BUCKET, news.imageUrl) : null
  }))

  return {
    data: news,
    meta: {
      startCursor: res.startCursor,
      endCursor: res.endCursor,
      hasNextPage: res.hasNextPage ?? false,
      hasPrevPage: res.hasPrevPage ?? false
    }
  }
}

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