import { forumDB } from "#shared/database/forum-db.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

async function getReports() {
  const query = await forumDB
    .selectFrom("reports")
    .innerJoin("users", "users.nickname", "reports.user_nickname")
    .select([
      "reports.id",
      "reports.created_at",
      "reports.reason",
      "reports.report_type",
      "reports.reported_item",
      "reports.description",
      "reports.target_user_nickname",
      "reports.user_nickname",
      "users.avatar as user_avatar"
    ])
    .execute()

  return query;
}

export const getReportsRoute = new Hono()
  .get("/get-reports", async (ctx) => {
    try {
      const data = await getReports();

      return ctx.json({ data }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })