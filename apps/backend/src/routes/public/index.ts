import { Hono } from "hono";
import { getNewsRoute } from "./get-news";
import { getOnlineUsersRoute } from "./get-online-users";
import { getLatestRegUsersRoute } from "./get-latest-reg-users";
import { getAlertRoute } from "./get-alerts";
import { getImagesLibraryRoute } from "./get-images-library";
import { getMediaRoute } from "./get-media";
import { getPublicStatsRoute } from "./get-public-stats";

export const shared = new Hono()
  .basePath("/shared")
  .route("/", getNewsRoute)
  .route("/", getOnlineUsersRoute)
  .route("/", getLatestRegUsersRoute)
  .route("/", getAlertRoute)
  .route("/", getImagesLibraryRoute)
  .route("/", getMediaRoute)
  .route("/", getPublicStatsRoute)