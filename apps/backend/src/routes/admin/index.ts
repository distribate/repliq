import { adminMiddleware } from "#middlewares/admin-access.ts";
import { validateRequest } from "#middlewares/validate-request.ts";
import { Hono } from "hono";
import { getTicketsRoute } from "./get-tickets";
import { getReportsRoute } from "./get-reports";
import { createUserRestrictRoute } from "#routes/warns/create-user-restrict.ts";
import { getAdminsRoute } from "./get-admins";

export const admin = new Hono()
  .basePath('/private')
  .use(validateRequest("prevent"))
  .use(adminMiddleware())
  .route("/", getTicketsRoute)
  .route("/", getReportsRoute)
  .route("/", createUserRestrictRoute)
  .route("/", getAdminsRoute)