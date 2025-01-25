import { forumDB } from "#shared/database/forum-db.ts";
import { zValidator } from "@hono/zod-validator";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { z } from "zod";

const getSearchSchema = z.object({
  type: z.enum(["user", "thread"]),
  queryValue: z.string()
})

async function getSearchThreads(queryValue: string) {
  return await forumDB
    .selectFrom("threads")
    .select(["id", "title"])
    .where("title", "like", `%${queryValue}%`)
    .limit(10)
    .execute()
}

async function getSearchUsers(queryValue: string) {
  return await forumDB
    .selectFrom("users")
    .select(["nickname", "name_color"])
    .where("nickname", "like", `%${queryValue}%`)
    .limit(10)
    .execute()
}

export const getSearchRoute = new Hono()
  .get("/get-search", zValidator("query", getSearchSchema), async (ctx) => {
    const query = ctx.req.query();
    const { queryValue, type } = getSearchSchema.parse(query)

    try {
      switch (type) {
        case "thread":
          const threads = await getSearchThreads(queryValue)

          return ctx.json({ data: threads }, 200)
        case "user":
          const users = await getSearchUsers(queryValue)

          return ctx.json({ data: users }, 200)
      }
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })