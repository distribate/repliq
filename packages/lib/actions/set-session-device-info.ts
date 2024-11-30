"use server"

import { createClient } from "#utils/api/supabase-client.ts";
import { userAgent } from "next/server";
import { headers } from "next/headers";

function parseIPv6toIPv4(ip: string): string {
	if (ip.startsWith('::ffff:')) {
		return ip.replace('::ffff:', '');
	}
	return ip;
}

export async function setSessionDeviceInfo(
	user_id: string, session_id: string
) {
	const api = createClient();
	
	const { ua, browser, isBot, cpu, os } = userAgent({
		headers: headers()
	})
	
	const operationSystem = os.name && os.version ? os.name + os.version
		: os.name ? os.name : os.version ? os.version : '';
	
	const IPv6 = headers().get("x-forwarded-for") ?? null
	let IPv4: string | null = null;
	
	if (IPv6) {
		IPv4 = parseIPv6toIPv4(IPv6)
	}
	
	const { error } = await api
	.from("users_session")
	.update({
		ua,
		ip: IPv4,
		browser: browser.name,
		isBot,
		cpu: cpu.architecture,
		os: operationSystem
	})
	.eq("user_id", user_id)
	.eq("id", session_id)
	
	return !!error;
}