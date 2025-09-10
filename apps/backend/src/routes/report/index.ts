import { Hono } from "hono";
import { getReportRoute } from "./get-report";
import { createReportRoute } from "./create-report";
import { approveReportRoute } from "./approve-report";
import { userActivityStatus } from "#middlewares/user-activity-status.ts";
import { requireAuth } from "#middlewares/require-auth.ts";

export const report = new Hono()
  .basePath('/report')
  .use(requireAuth("prevent"))
  .use(userActivityStatus())
  .route("/", getReportRoute)
  .route("/", createReportRoute)
  .route("/", approveReportRoute)