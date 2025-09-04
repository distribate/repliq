import { userStatus } from "#middlewares/user-status.ts";
import { validateRequest } from "#middlewares/validate-request.ts";
import { Hono } from "hono";
import { getSearchRoute } from "./get-search";

export const search = new Hono()
  .basePath('/search')
  .use(validateRequest("prevent"))
  .use(userStatus())
  .route("/", getSearchRoute)
