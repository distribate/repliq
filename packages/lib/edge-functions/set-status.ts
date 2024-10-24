"use server"

import { createClient } from "../utils/supabase/server.ts";

export async function setStatus(id: string) {
	const supabase = createClient()
	
	return supabase.rpc('set_status', { p_user_id: id, p_value: true })
}