"use server"

import "server-only"
import { createClient } from "../utils/supabase/server.ts";
import { validateRequest } from "../utils/auth/validate-requests.ts";

export async function checkAdminPermission(): Promise<boolean> {
	const supabase = createClient();
	
	const { user } = await validateRequest()
	if (!user) return false;
	
	const { data, error } = await supabase
	.from("admins")
	.select("id")
	.eq("admin_id", user.id)
	.single()
	
	if (error) return false;
	
	return !!data;
}