import { Hono } from "hono";
import { getLatestCategoryThreadsRoute } from "./get-latest-category-threads";
import { validateRequest } from "#middlewares/validate-request.ts";
import { userStatus } from "#middlewares/user-status.ts";
import { getCategoriesRoute } from "./get-categories";
import { getCategoryThreadsRoute } from "./get-category-threads";
import { getAvailableCategoriesRoute } from "./get-available-categories";
import { getCategoryRoute } from "./get-category";

export const category = new Hono()
  .basePath('/categories')
  .route("/", getLatestCategoryThreadsRoute)
  .use(validateRequest("prevent"))
  .use(userStatus())
  .route("/", getCategoriesRoute)
  .route("/", getCategoryThreadsRoute)
  .route("/", getAvailableCategoriesRoute)
  .route("/", getCategoryRoute)