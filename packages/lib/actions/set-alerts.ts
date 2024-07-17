"use server"

import { cookies } from "next/headers";
import { ALERTS_COOKIE_KEY } from "@repo/shared/keys/cookie.ts"

export async function setAlerts() {
	const cookieStore = cookies()
	const hasAlertsShowing = cookieStore.get(
		ALERTS_COOKIE_KEY
	)
	
	if (hasAlertsShowing && hasAlertsShowing.value !== 'show') {
		cookieStore.set(ALERTS_COOKIE_KEY, 'show');
	}
}