import { validateRequest } from "#middlewares/validate-request.ts";
import { Hono } from "hono";
import { getThreadsByOwnerRoute } from "./get-threads-by-owner";
import { getThreadRoute } from "./get-thread";
import { userStatus } from "#middlewares/user-status.ts";
import { getThreadPreviewRoute } from "./get-thread-preview";
import { removeThreadRoute } from "./remove-thread";
import { updateThreadSettingsRoute } from "./update-thread-settings";
import { getThreadCommentsRoute } from "#routes/comments/get-thread-comments.ts";
import { getThreadUserReactionsRoute } from "./get-thread-user-rating";
import { createThreadRoute } from "./create-thread";
import { getLatestThreadsRoute } from "./get-latest-threads";
import { saveThreadRoute, unsaveThreadRoute } from "./save-thread";

export const thread = new Hono()
  .basePath('/thread')
  .use(validateRequest())
  .route("/", getThreadRoute)
  .route("/", getThreadsByOwnerRoute)
  .use(validateRequest("prevent"))
  .use(userStatus())
  .route("/", getThreadPreviewRoute)
  .route("/", removeThreadRoute)
  .route("/", updateThreadSettingsRoute)
  .route("/", getThreadCommentsRoute)
  .route("/", getThreadUserReactionsRoute)
  .route("/", createThreadRoute)
  .route("/", getLatestThreadsRoute)
  .route("/", saveThreadRoute)
  .route("/", unsaveThreadRoute)