"use server"

import { createClient } from "@repo/lib/utils/api/server.ts";
import { userAgent } from "next/server";
import { headers } from "next/headers";

export async function setSessionDeviceInfo(
	user_id: string,
	session_id: string
) {
	const supabase = createClient();
	
	const {
		ua,
		browser,
		isBot,
		cpu,
		os
	} = userAgent({
		headers: headers()
	})
	
	const operationSystem = os.name && os.version ? os.name + os.version
		: os.name ? os.name : os.version ? os.version : '';
	
	const { data, error, status } = await supabase
	.from("users_session")
	.update({
		ua, browser: browser.name, isBot,
		cpu: cpu.architecture, os: operationSystem
	})
	.eq("user_id", user_id)
	.eq("id", session_id)
	.select()
	
	if (error) throw error;
	
	return !!data;
}