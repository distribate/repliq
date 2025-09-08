import { userStatus } from "#middlewares/user-status.ts";
import { validateRequest } from "#middlewares/validate-request.ts";
import { Hono } from "hono";
import { createPostRoute } from "./create-post";
import { removePostRoute } from "./delete-post";
import { editPostRoute } from "./edit-post";
import { pinPostRoute } from "./pin-post";
import { getPostViewersRoute } from "./get-post-viewers";
import { createPostReactionRoute } from "./create-post-reaction";

export const post = new Hono()
  .basePath('/post')
  .use(validateRequest("prevent"))
  .use(userStatus())
  .route("/", createPostRoute)
  .route("/", removePostRoute)
  .route("/", editPostRoute)
  .route('/', pinPostRoute)
  .route("/", getPostViewersRoute)
  .route("/", createPostReactionRoute)
