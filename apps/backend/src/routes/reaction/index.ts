import { Hono } from "hono";
import { createReactionRoute } from "./create-reaction";
import { validateRequest } from "#middlewares/validate-request.ts";
import { userStatus } from "#middlewares/user-status.ts";

export const reaction = new Hono()
  .basePath('/reaction')
  .use(validateRequest("prevent"))
  .use(userStatus())
  .route("/", createReactionRoute)
