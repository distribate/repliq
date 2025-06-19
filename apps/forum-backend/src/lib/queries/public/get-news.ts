import { sqliteDB } from "#shared/database/sqlite-db.ts";
import { getPublicUrl } from "#utils/get-public-url.ts";
import { STATIC_IMAGES_BUCKET } from "@repo/shared/constants/buckets";
import type { getNewsSchema } from "@repo/types/schemas/news/get-news-schema";
import { executeWithCursorPagination } from "kysely-paginate";
import { z } from "zod/v4";

type GetNews = z.infer<typeof getNewsSchema>;

export async function getNews({
  ascending, cursor, limit = 2, searchQuery
}: GetNews) {
  let query = sqliteDB
    .selectFrom("minecraft_news")
    .select(["id", "title", "description", "imageUrl", "created_at"])
    .$castTo<{ id: string, title: string, description: string, created_at: Date | string, imageUrl: string }>()
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
    parseCursor: (cursor) => {
      return {
        created_at: new Date(cursor.created_at),
      }
    },
  })

  const news = res.rows.map((news) => {
    if (!news.imageUrl) return news;

    return {
      ...news,
      created_at: news.created_at.toString(),
      imageUrl: getPublicUrl(STATIC_IMAGES_BUCKET, news.imageUrl)
    };
  })

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