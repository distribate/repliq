import { Hono } from "hono";
import { getThreadsByOwnerRoute } from "./get-threads-by-owner";
import { getThreadRoute } from "./get-thread";
import { getThreadPreviewRoute } from "./get-thread-preview";
import { removeThreadRoute } from "./remove-thread";
import { updateThreadSettingsRoute } from "./update-thread-settings";
import { getThreadCommentsRoute } from "#routes/thread/get-thread-comments.ts";
import { getThreadReactionsRoute } from "./get-thread-reactions.ts";
import { createThreadRoute } from "./create-thread";
import { getLatestThreadsRoute } from "./get-latest-threads";
import { saveThreadRoute, unsaveThreadRoute } from "./save-thread";
import { createThreadReactionRoute } from "./create-thread-reaction";
import { userActivityStatus } from "#middlewares/user-activity-status.ts";
import { requireAuth } from "#middlewares/require-auth.ts";

export const thread = new Hono()
  .basePath('/thread')
  .use(requireAuth())
  .route("/", getThreadRoute)
  .route("/", getThreadsByOwnerRoute)
  .route("/", getThreadReactionsRoute)
  .use(requireAuth("prevent"))
  .use(userActivityStatus())
  .route("/", getThreadPreviewRoute)
  .route("/", removeThreadRoute)
  .route("/", updateThreadSettingsRoute)
  .route("/", getThreadCommentsRoute)
  .route("/", createThreadRoute)
  .route("/", getLatestThreadsRoute)
  .route("/", saveThreadRoute)
  .route("/", unsaveThreadRoute)
  .route("/", createThreadReactionRoute)