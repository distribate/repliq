import { Hono } from "hono";
import { throwError } from "@repo/lib/helpers/throw-error";
import { forumDB } from "#shared/database/forum-db.ts";

async function getUserReferals(nickname: string) {
  const query = await forumDB
    .selectFrom("refferals")
    .innerJoin("users", "users.nickname", "refferals.recipient")
    .select([
      "refferals.id",
      "refferals.recipient",
      "users.donate",
      "users.name_color",
      "users.description",
      "refferals.created_at",
      "refferals.completed"
    ])
    .where("initiator", "=", nickname)
    .limit(5)
    .orderBy("refferals.created_at", "desc")
    .execute()

  return query;
}

export const getUserReferalsRoute = new Hono()
  .get("/get-user-referals/:nickname", async (ctx) => {
    const { nickname: recipient } = ctx.req.param();

    try {
      const referals = await getUserReferals(recipient);

      return ctx.json({ data: referals }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })