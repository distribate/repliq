import { createClient } from "@repo/lib/utils/supabase/server.ts";
import { ALERT } from "@repo/types/entities/entities-type.ts"

export async function getAlerts() {
	const supabase = createClient();
	
	let query = supabase
	.from("config_alerts")
	.select()
	.returns<ALERT[]>()
	
	const { data, error } = await query;
	
	if (error) throw error;
	
	return data;
}