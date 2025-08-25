import { forumDB } from "#shared/database/forum-db.ts";
import { throwError } from "#utils/throw-error.ts";
import { Hono } from "hono";

async function getReport(id: string) {
  const query = await forumDB
    .selectFrom("reports")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst()
    
  return query;
}

export const getReportRoute = new Hono()
  .get("/get-report/:id", async (ctx) => {
    const id = ctx.req.param("id");

    try {
      const report = await getReport(id)

      if (!report) {
        return ctx.json({ error: "Report not found" }, 404)
      }

      return ctx.json({ data: report }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })