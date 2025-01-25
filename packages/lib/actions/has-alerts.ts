import { ALERTS_COOKIE_KEY } from "@repo/shared/keys/cookie.ts";
import { getCookieByKey } from "../helpers/get-cookie-by-key";

export function hasAlertsShow(): boolean {
  const hasAlertsShowing = getCookieByKey(ALERTS_COOKIE_KEY);

  if (hasAlertsShowing === "show") return true;

  return hasAlertsShowing !== "hide";
}