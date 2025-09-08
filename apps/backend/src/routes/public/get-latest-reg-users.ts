import { forumDB } from "#shared/database/forum-db.ts";
import { zValidator } from "@hono/zod-validator";
import { throwError } from "#utils/throw-error.ts";
import { Hono } from "hono";
import * as z from "zod";

const DEFAULT_LIMIT = 7

async function getLatestRegUsers({ limit }: { limit?: number }) {
  const query = await forumDB
    .selectFrom("users")
    .leftJoin("users_subs", "users.nickname", "users_subs.nickname")
    .select(eb => [
      "users.id",
      "users.nickname",
      "users.name_color",
      "users.description",
      "users.avatar",
      "users.created_at",
      eb.case()
        .when('users_subs.id', 'is not', null)
        .then(true)
        .else(false)
        .end()
        .as('is_donate'),
      eb.cast<string>("users.created_at", "text").as("created_at"),
    ])
    .limit(limit ?? DEFAULT_LIMIT)
    .orderBy("users.created_at", "desc")
    .execute()

  return query;
}

const getLatestRegUsersSchema = z.object({
  limit: z.string().transform(Number).optional(),
})

export const getLatestRegUsersRoute = new Hono()
  .get("/latest-reg-users", zValidator("query", getLatestRegUsersSchema), async (ctx) => {
    const { limit } = getLatestRegUsersSchema.parse(ctx.req.query());

    try {
      const data = await getLatestRegUsers({ limit });

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })