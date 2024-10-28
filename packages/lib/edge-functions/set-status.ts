"use server"

import { createClient } from "@repo/lib/utils/api/server.ts";

export async function setStatus(id: string) {
	const api = createClient()
	
	return api.rpc('set_status', { p_user_id: id, p_value: true })
}