import 'server-only';
import { createClient } from "@repo/lib/utils/supabase/server.ts";
import { ALERT } from "@repo/types/entities/entities-type.ts"

export async function getAlerts() {
	const supabase = createClient();
	
	const { data, error } = await supabase
	.from("config_alerts")
	.select()
	.returns<ALERT[]>()
	
	if (error) {
		throw new Error(error.message);
	}
	
	return data;
}