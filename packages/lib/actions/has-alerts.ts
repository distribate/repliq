"use server"

import { cookies } from "next/headers";
import { ALERTS_COOKIE_KEY } from "@repo/shared/keys/cookie.ts"

export async function hasAlertsShow(): Promise<boolean> {
	const cookieStore = cookies();
	const hasAlertsShowing = cookieStore.get(
		ALERTS_COOKIE_KEY
	)
	
	if (hasAlertsShowing?.value === 'show') return true;
	
	return hasAlertsShowing?.value !== 'hide';
}