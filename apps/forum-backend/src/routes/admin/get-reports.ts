import { forumDB } from "#shared/database/forum-db.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

async function getReports() {
  const query = await forumDB
    .selectFrom("reports")
    .selectAll()
    .execute()

  return query;
}

export const getReportsRoute = new Hono()
  .get("/get-reports", async (ctx) => {
    try {
      const reports = await getReports();

      return ctx.json({ data: reports }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })