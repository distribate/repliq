import { forumDB } from "#shared/database/forum-db.ts";
import { getPublicUrl } from "#utils/get-public-url.ts";
import { STATIC_IMAGES_BUCKET } from "@repo/shared/constants/buckets";
import type { getNewsSchema } from "@repo/types/schemas/news/get-news-schema";
import { executeWithCursorPagination } from "kysely-paginate";
import type { z } from "zod/v4";

type GetNews = z.infer<typeof getNewsSchema>;

export async function getNews({
  ascending, cursor, limit, searchQuery
}: GetNews) {
  let query = forumDB
    .selectFrom("news")
    .select(["id", "title", "description", "imageUrl", "created_at"])
    .limit(limit ?? 2)

  if (searchQuery) {
    query = query.where("title", "like", `%${searchQuery}%`)
  }

  const res = await executeWithCursorPagination(query, {
    perPage: limit ?? 2,
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

  const news = await Promise.all(
    res.rows.map(async (news) => {
      if (!news.imageUrl) return news;

      const publicUrl = getPublicUrl(STATIC_IMAGES_BUCKET, news.imageUrl);

      return {
        ...news,
        created_at: news.created_at.toString(),
        imageUrl: publicUrl
      };
    })
  );

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