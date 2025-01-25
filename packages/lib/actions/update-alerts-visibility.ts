import { getCookieByKey } from "#helpers/get-cookie-by-key.ts";
import { ALERTS_COOKIE_KEY } from "@repo/shared/keys/cookie.ts";

export async function updateAlertsVisibility() {
  const hasAlertsShowing = getCookieByKey(ALERTS_COOKIE_KEY);

  if (hasAlertsShowing && hasAlertsShowing !== "show") {
    document.cookie = `${ALERTS_COOKIE_KEY}=show`;
    return "show"
  }

  document.cookie = `${ALERTS_COOKIE_KEY}=hide`;
  
  return "hide"
}