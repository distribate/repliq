import { forumDB } from "#shared/database/forum-db.ts";
import { supabase } from "#shared/supabase/supabase-client.ts";
import { zValidator } from "@hono/zod-validator";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { executeWithCursorPagination } from "kysely-paginate";
import { z } from "zod";
import { getNewsSchema } from "@repo/types/schemas/news/get-news-schema.ts";

async function getPublicUrl(bucket: string, url: string) {
  return supabase.storage.from(bucket).getPublicUrl(url);
}

async function getNews({
  ascending, cursor, limit, searchQuery
}: z.infer<typeof getNewsSchema>) {
  let query = forumDB
    .selectFrom("landing_news")
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

      const publicUrl = await getPublicUrl("static", news.imageUrl);

      return {
        ...news,
        created_at: news.created_at.toString(),
        imageUrl: publicUrl.data.publicUrl,
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

export const getNewsRoute = new Hono()
  .get("/get-news", zValidator("query", getNewsSchema), async (ctx) => {
    const query = ctx.req.query();
    const result = getNewsSchema.parse(query);

    try {
      const news = await getNews(result);

      return ctx.json(news, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })