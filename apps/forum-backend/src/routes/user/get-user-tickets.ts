import { forumDB } from "#shared/database/forum-db.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

async function getTickets(nickname: string) {
  const query = await forumDB
    .selectFrom("issues")
    .leftJoin("issues_approvals", "issues_approvals.issue_id", "issues.id")
    .innerJoin("users", "users.nickname", "issues.user_nickname")
    .select([
      "issues.id",
      "issues.title",
      "issues.description",
      "issues.type",
      "issues.user_nickname",
      "issues_approvals.responser as approved_by",
      "issues_approvals.message as approved_message",
      "issues_approvals.created_at as approved_at",
      "users.avatar as user_avatar",
    ])
    .where("issues.user_nickname", "=", nickname)
    .execute()

  return query
}

export const getUserTicketsRoute = new Hono()
  .get("/get-user-tickets/:nickname", async (ctx) => {
    const { nickname } = ctx.req.param()

    try {
      const tickets = await getTickets(nickname)

      return ctx.json({ data: tickets }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })