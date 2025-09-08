import { forumDB } from "#shared/database/forum-db.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { throwError } from "#utils/throw-error.ts";
import { Hono } from "hono";
import { executeWithCursorPagination } from "kysely-paginate";

async function getTickets(
  nickname: string,
  { cursor, ascending }: { cursor?: string, ascending: boolean }
) {
  const direction = ascending ? "asc" : "desc";

  let query = forumDB
    .selectFrom("issues")
    .leftJoin("issues_approvals", "issues_approvals.issue_id", "issues.id")
    .innerJoin("users", "users.nickname", "issues.nickname")
    .select([
      "issues.id",
      "issues.title",
      "issues.description",
      "issues.type",
      "issues.nickname",
      "issues.created_at",
      "issues_approvals.responser as approved_by",
      "issues_approvals.message as approved_message",
      "issues_approvals.created_at as approved_at",
      "users.avatar as user_avatar",
    ])
    .where("issues.nickname", "=", nickname)

  const res = await executeWithCursorPagination(query, {
    after: cursor,
    perPage: 16,
    fields: [
      {
        key: "created_at",
        expression: "issues.created_at",
        direction
      }
    ],
    parseCursor: (cursor) => ({
      created_at: new Date(cursor.created_at)
    })
  })

  return {
    data: res.rows,
    meta: {
      hasNextPage: res.hasNextPage ?? false,
      hasPrevPage: res.hasPrevPage ?? false,
      startCursor: res.startCursor,
      endCursor: res.endCursor
    }
  }
}

export const getUserTicketsRoute = new Hono()
  .get("/user-tickets", async (ctx) => {
    const nickname = getNickname()

    try {
      const data = await getTickets(nickname, { ascending: false, cursor: undefined })

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })