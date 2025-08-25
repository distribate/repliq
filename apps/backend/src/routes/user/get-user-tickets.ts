import { forumDB } from "#shared/database/forum-db.ts";
import { throwError } from "#utils/throw-error.ts";
import { Hono } from "hono";

async function getTickets(nickname: string) {
  const query = await forumDB
    .selectFrom("issues")
    .leftJoin("issues_approvals", "issues_approvals.issue_id", "issues.id")
    .innerJoin("users", "users.nickname", "issues.nickname")
    .select([
      "issues.id",
      "issues.title",
      "issues.description",
      "issues.type",
      "issues.nickname",
      "issues_approvals.responser as approved_by",
      "issues_approvals.message as approved_message",
      "issues_approvals.created_at as approved_at",
      "users.avatar as user_avatar",
    ])
    .where("issues.nickname", "=", nickname)
    .execute()

  return query
}

export const getUserTicketsRoute = new Hono()
  .get("/get-user-tickets/:nickname", async (ctx) => {
    const nickname = ctx.req.param("nickname")

    try {
      const data = await getTickets(nickname)

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })