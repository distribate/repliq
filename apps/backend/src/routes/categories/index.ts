import { Hono } from "hono";
import { getLatestCategoryThreadsRoute } from "./get-latest-category-threads";
import { getCategoriesRoute } from "./get-categories";
import { getCategoryThreadsRoute } from "./get-category-threads";
import { getAvailableCategoriesRoute } from "./get-available-categories";
import { getCategoryRoute } from "./get-category";
import { requireAuth } from "#middlewares/require-auth.ts";
import { userActivityStatus } from "#middlewares/user-activity-status.ts";

export const category = new Hono()
  .basePath('/category')
  .route("/", getLatestCategoryThreadsRoute)
  .route("/", getCategoryRoute)
  .route("/", getCategoriesRoute)
  .route("/", getCategoryThreadsRoute)
  .use(requireAuth("prevent"))
  .use(userActivityStatus())
  .route("/", getAvailableCategoriesRoute)