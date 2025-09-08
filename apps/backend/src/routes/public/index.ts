import { Hono } from "hono";
import { getOnlineUsersRoute } from "./get-online-users";
import { getLatestRegUsersRoute } from "./get-latest-reg-users";
import { getAlertRoute } from "./get-alerts";
import { getImagesLibraryRoute } from "./get-images-library";
import { getMediaRoute } from "./get-media";
import { getPublicStatsRoute } from "./get-public-stats";
import { getUpdatesRoute } from "./get-news";

export const shared = new Hono()
  .basePath("/shared")
  .route("/", getUpdatesRoute)
  .route("/", getOnlineUsersRoute)
  .route("/", getLatestRegUsersRoute)
  .route("/", getAlertRoute)
  .route("/", getImagesLibraryRoute)
  .route("/", getMediaRoute)
  .route("/", getPublicStatsRoute)