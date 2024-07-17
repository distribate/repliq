"use server"

import { cookies } from "next/headers";
import { ALERTS_COOKIE_KEY } from "@repo/shared/keys/cookie.ts"

export async function disableAlerts(){
	cookies().set(ALERTS_COOKIE_KEY, 'hide')
}