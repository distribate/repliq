import { validateRequest } from "#middlewares/validate-request.ts";
import { Hono } from "hono";
import { getThreadsByOwnerRoute } from "./get-threads-by-owner";
import { getThreadRoute } from "./get-thread";
import { userStatus } from "#middlewares/user-status.ts";
import { getThreadPreviewRoute } from "./get-thread-preview";
import { removeThreadRoute } from "./remove-thread";
import { updateThreadSettingsRoute } from "./update-thread-settings";
import { getThreadCommentsRoute } from "#routes/thread/get-thread-comments.ts";
import { getThreadReactionsRoute } from "./get-thread-reactions.ts";
import { createThreadRoute } from "./create-thread";
import { getLatestThreadsRoute } from "./get-latest-threads";
import { saveThreadRoute, unsaveThreadRoute } from "./save-thread";
import { createThreadReactionRoute } from "./create-thread-reaction";

export const thread = new Hono()
  .basePath('/thread')
  .use(validateRequest())
  .route("/", getThreadRoute)
  .route("/", getThreadsByOwnerRoute)
  .route("/", getThreadReactionsRoute)
  .use(validateRequest("prevent"))
  .use(userStatus())
  .route("/", getThreadPreviewRoute)
  .route("/", removeThreadRoute)
  .route("/", updateThreadSettingsRoute)
  .route("/", getThreadCommentsRoute)
  .route("/", createThreadRoute)
  .route("/", getLatestThreadsRoute)
  .route("/", saveThreadRoute)
  .route("/", unsaveThreadRoute)
  .route("/", createThreadReactionRoute)