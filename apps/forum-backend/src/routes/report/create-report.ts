import { forumDB } from "#shared/database/forum-db.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { zValidator } from "@hono/zod-validator";
import { throwError } from "@repo/lib/helpers/throw-error";
import type { ReportReason, Reports, ReportType } from "@repo/types/db/forum-database-types";
import { Hono } from "hono";
import type { Insertable } from "kysely";
import * as z from "zod";

type CreateReport = Omit<Insertable<Reports>, "id" | "created_at">

async function createReport({
  target_user_nickname, user_nickname, description, reason, report_type, reported_item
}: CreateReport) {
  return forumDB
    .insertInto("reports")
    .values({
      target_user_nickname,
      user_nickname,
      reason,
      report_type,
      reported_item,
      description,
    })
    .returning("id")
    .executeTakeFirstOrThrow()
}

const createReportSchema = z.object({
  target_user_nickname: z.string(),
  description: z.string().optional(),
  reason: z.custom<ReportReason>(),
  report_type: z.custom<ReportType>(),
  reported_item: z.string(),
})

export const createReportRoute = new Hono()
  .post("/create-report", zValidator("json", createReportSchema), async (ctx) => {
    const nickname = getNickname()
    const result = createReportSchema.parse(await ctx.req.json())

    try {
      const createdReport = await createReport({
        ...result, user_nickname: nickname
      })

      if (!createdReport.id) {
        return ctx.json({ error: "Error creating report" }, 400)
      }

      return ctx.json({ status: "Success" }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })