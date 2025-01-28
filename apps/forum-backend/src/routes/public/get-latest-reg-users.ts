import { forumDB } from "#shared/database/forum-db.ts";
import { zValidator } from "@hono/zod-validator";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { z } from "zod";

async function getLatestRegUsers({ limit }: { limit?: number }) {
  return await forumDB
    .selectFrom("users")
    .select(["id", "nickname", "name_color", "description"])
    .limit(limit ?? 7)
    .orderBy("created_at", "desc")
    .execute()
}

const getLatestRegUsersSchema = z.object({
  limit: z.string().transform(Number).optional(),
})

export const getLatestRegUsersRoute = new Hono()
  .get("/get-latest-reg-users", zValidator("query", getLatestRegUsersSchema), async (ctx) => {
    const { limit } = getLatestRegUsersSchema.parse(ctx.req.query());

    try {
      const users = await getLatestRegUsers({ limit });

      return ctx.json({ data: users }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })