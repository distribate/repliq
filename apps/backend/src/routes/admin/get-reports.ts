import { forumDB } from "#shared/database/forum-db.ts";
import { throwError } from "#utils/throw-error.ts";
import { Hono } from "hono";

async function getReports() {
  return forumDB
    .selectFrom("reports")
    .innerJoin("users", "users.nickname", "reports.nickname")
    .select([
      "reports.id",
      "reports.created_at",
      "reports.reason",
      "reports.report_type",
      "reports.reported_item",
      "reports.description",
      "reports.target_user_nickname",
      "reports.nickname",
      "users.avatar as user_avatar",
      "users.name_color as user_name_color"
    ])
    .execute()
}

export const getReportsRoute = new Hono()
  .get("/reports", async (ctx) => {
    try {
      const data = await getReports();

      return ctx.json({ data }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })