"use server"

import "server-only"
import { createClient } from "@repo/lib/utils/api/server.ts";
import { validateRequest } from "../utils/auth/validate-requests.ts";

export async function checkAdminPermission(): Promise<boolean> {
	const api = createClient();
	
	const { user } = await validateRequest()
	if (!user) return false;
	
	const { data, error } = await api
	.from("admins")
	.select("id")
	.eq("admin_id", user.id)
	.single()
	
	if (error) return false;
	
	return !!data;
}