import { forumDB } from "#shared/database/forum-db.ts";
import { zValidator } from "@hono/zod-validator";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import * as z from "zod";

const getSearchSchema = z.object({
  type: z.enum(["user", "thread"]),
  queryValue: z.string(),
  limit: z.string().transform(Number).optional()
})

type GetSearch = Omit<z.infer<typeof getSearchSchema>, "type">

async function getSearchThreads({ queryValue, limit }: GetSearch) {
  const query = await forumDB
    .selectFrom("threads")
    .select(["id", "title"])
    .where("title", "like", `%${queryValue}%`)
    .limit(limit ?? 10)
    .execute()

  return query;
}

async function getSearchUsers({ queryValue, limit }: GetSearch) {
  const query = await forumDB
    .selectFrom("users")
    .select(["nickname", "name_color", "avatar"])
    .where("nickname", "like", `%${queryValue}%`)
    .limit(limit ?? 10)
    .execute()

  return query;
}

export const getSearchRoute = new Hono()
  .get("/get-search", zValidator("query", getSearchSchema), async (ctx) => {
    const { queryValue, type, limit } = getSearchSchema.parse(ctx.req.query())

    try {
      switch (type) {
        case "thread":
          const threads = await getSearchThreads({ queryValue, limit })

          return ctx.json({ data: threads }, 200)
        case "user":
          const users = await getSearchUsers({ queryValue, limit })

          return ctx.json({ data: users }, 200)
      }
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })