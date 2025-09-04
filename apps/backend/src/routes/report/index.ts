import { userStatus } from "#middlewares/user-status.ts";
import { validateRequest } from "#middlewares/validate-request.ts";
import { Hono } from "hono";
import { getReportRoute } from "./get-report";
import { createReportRoute } from "./create-report";
import { approveReportRoute } from "./approve-report";

export const report = new Hono()
  .basePath('/report')
  .use(validateRequest("prevent"))
  .use(userStatus())
  .route("/", getReportRoute)
  .route("/", createReportRoute)
  .route("/", approveReportRoute)