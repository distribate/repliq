import { requireAdmin } from "#middlewares/admin-access.ts";
import { Hono } from "hono";
import { getTicketsRoute } from "./get-tickets";
import { getReportsRoute } from "./get-reports";
import { createUserRestrictRoute } from "#routes/warns/create-user-restrict.ts";
import { getAdminsRoute } from "./get-admins";
import { requireAuth } from "#middlewares/require-auth.ts";

export const admin = new Hono()
  .basePath('/private')
  .use(requireAuth("prevent"))
  .use(requireAdmin())
  .route("/", getTicketsRoute)
  .route("/", getReportsRoute)
  .route("/", createUserRestrictRoute)
  .route("/", getAdminsRoute)