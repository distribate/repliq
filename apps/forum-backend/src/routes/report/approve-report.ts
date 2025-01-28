import { forumDB } from "#shared/database/forum-db.ts";
import { zValidator } from "@hono/zod-validator";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { z } from "zod";

type ApproveReportSchema = z.infer<typeof approveReportSchema> & {
  id: number
}

async function approveReport({
  message, status, id
}: ApproveReportSchema) {
  return await forumDB.transaction().execute(async (trx) => {
    const approved = await trx
      .insertInto("reports_approvals")
      // @ts-ignore
      .values({
        report_id: id.toString(),
        status,
        message: message ?? null
      })
      .returning("id")
      .executeTakeFirstOrThrow()

    return approved
  })
}

const approveReportSchema = z.object({
  message: z.string().optional(),
  status: z.enum(["approved", "rejected"])
})

export const approveReportRoute = new Hono()
  .post("/approve-report/:id", zValidator("json", approveReportSchema), async (ctx) => {
    const { id } = ctx.req.param();
    const { message, status } = approveReportSchema.parse(await ctx.req.json())

    try {
      const report = await approveReport({
        id: Number(id), status, message
      })

      if (!report.id) {
        return ctx.json({ error: "Error approving report" }, 404)
      }

      return ctx.json({ status: "Approved", data: report }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })