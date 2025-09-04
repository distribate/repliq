import { userStatus } from "#middlewares/user-status.ts";
import { validateRequest } from "#middlewares/validate-request.ts";
import { Hono } from "hono";
import { createCommentRoute } from "./create-comment";
import { replyCommentRoute } from "./reply-comment";
import { disableCommentsRoute } from "./disable-comments";
import { getLastCommentsRoute } from "./get-last-comments";
import { removeCommentRoute } from "./remove-comment";

export const comment = new Hono()
  .basePath('/comment')
  .use(validateRequest("prevent"))
  .use(userStatus())
  .route("/", createCommentRoute)
  .route("/", replyCommentRoute)
  .route("/", disableCommentsRoute)
  .route("/", getLastCommentsRoute)
  .route("/", removeCommentRoute)