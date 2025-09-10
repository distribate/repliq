import { zValidator } from "@hono/zod-validator";
import { throwError } from "#utils/throw-error.ts";
import { Hono } from "hono";
import { sqliteDB } from "#shared/database/sqlite-db.ts";
import { getPublicUrl } from "#utils/get-public-url.ts";
import { STATIC_IMAGES_BUCKET } from "@repo/shared/constants/buckets";
import { getNewsSchema } from "@repo/types/schemas/news/get-news-schema";
import { executeWithCursorPagination } from "kysely-paginate";
import * as z from "zod";

type GetNews = z.infer<typeof getNewsSchema>;

type NewsType = 'announcement' | 'update' | 'feature' | 'bugfix' | "default";

const DEFAULT_LIMIT = 16;

async function getNews({
  ascending, cursor, limit = DEFAULT_LIMIT, searchQuery
}: Omit<GetNews, "type">) {
  let query = sqliteDB
    .selectFrom("news")
    .select([
      "id",
      "created_at",
      "title",
      "description",
      "imageUrl",
    ])
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
    parseCursor: (cursor) => ({
      created_at: new Date(cursor.created_at)
    }),
  })

  const news = res.rows.map((news) => ({
    ...news,
    id: news.id!,
    created_at: news.created_at.toString(),
    imageUrl: news.imageUrl ? getPublicUrl(STATIC_IMAGES_BUCKET, news.imageUrl) : null,
    type: "default" as NewsType,
    tags: []
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

export const getUpdatesRoute = new Hono()
  .get("/news", zValidator("query", getNewsSchema), async (ctx) => {
    const result = getNewsSchema.parse(ctx.req.query());

    try {
      const data = await getNews(result);

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })