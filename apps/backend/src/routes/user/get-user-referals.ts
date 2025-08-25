import { Hono } from "hono";
import { throwError } from "#utils/throw-error.ts";
import { forumDB } from "#shared/database/forum-db.ts";

async function getUserReferals(nickname: string) {
  const query = await forumDB
    .selectFrom("refferals")
    .innerJoin("users", "users.nickname", "refferals.recipient")
    .leftJoin("users_subs", "users.nickname", "users_subs.nickname")
    .select(eb => [
      "refferals.id",
      "refferals.recipient",
      "users.name_color",
      "users.description",
      "refferals.created_at",
      "refferals.completed",
      eb.case()
        .when('users_subs.id', 'is not', null)
        .then(true)
        .else(false)
        .end()
        .as('is_donate'),
    ])
    .where("initiator", "=", nickname)
    .limit(5)
    .orderBy("refferals.created_at", "desc")
    .execute()

  return query;
}

export const getUserReferalsRoute = new Hono()
  .get("/get-user-referals/:nickname", async (ctx) => {
    const recipient = ctx.req.param("nickname");

    try {
      const data = await getUserReferals(recipient);

      return ctx.json({ data }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })