import { createClient } from "../utils/supabase/server.ts";

export async function getLastUsers() {
	const supabase = createClient();
	
	const { data, error } = await supabase
	.from("users")
	.select(`
		nickname,
		description,
	  created_at,
	  name_color
	`)
	.range(0, 6)
	.limit(6)
	.order('created_at', {
		ascending: false
	})
	
	if (error) throw error;
	
	if (!data.length) return null;
	
	return data;
}