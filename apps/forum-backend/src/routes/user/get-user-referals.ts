import { Hono } from "hono";
import { throwError } from "@repo/lib/helpers/throw-error";
import { forumDB } from "#shared/database/forum-db.ts";

async function getUserReferals(nickname: string) {
  return await forumDB
  .selectFrom("refferals")
  .innerJoin("users", "users.nickname", "refferals.recipient")
  .select([
    "refferals.id",
    "refferals.recipient",
    "users.donate",
    "users.name_color",
    "users.description"
  ])
  .where("initiator", "=", nickname)
  .execute()
}

export const getUserReferalsRoute = new Hono()
  .get("/get-user-referals/:nickname", async (ctx) => {
    const { nickname } = ctx.req.param();

    try {
      const referals = await getUserReferals(nickname);

      return ctx.json({ data: referals }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })