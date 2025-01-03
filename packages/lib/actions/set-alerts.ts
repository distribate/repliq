"use server";

import { cookies } from "next/headers";
import { ALERTS_COOKIE_KEY } from "@repo/shared/keys/cookie.ts";

export async function setAlerts() {
  const hasAlertsShowing = cookies().get(ALERTS_COOKIE_KEY);

  if (hasAlertsShowing && hasAlertsShowing.value !== "show") {
    cookies().set(ALERTS_COOKIE_KEY, "show");
    return "show"
  }

  cookies().set(ALERTS_COOKIE_KEY, "hide");
  return "hide"
}
