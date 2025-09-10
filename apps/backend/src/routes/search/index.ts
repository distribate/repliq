import { Hono } from "hono";
import { getSearchRoute } from "./get-search";
import { requireAuth } from "#middlewares/require-auth.ts";
import { userActivityStatus } from "#middlewares/user-activity-status.ts";

export const search = new Hono()
  .basePath('/search')
  .use(requireAuth("prevent"))
  .use(userActivityStatus())
  .route("/", getSearchRoute)
