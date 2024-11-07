"use server"

import "server-only"
import { createClient } from "@repo/lib/utils/api/server.ts";
import { validateRequest } from "../utils/auth/validate-requests.ts";

export async function checkAdminPermission(): Promise<boolean> {
	const { user } = await validateRequest()
	if (!user) return false;
	
	const api = createClient();
	
	const { data, error } = await api
	.from("admins")
	.select("id")
	.eq("user_id", user.id)
	.single()
	
	if (error) return false;
	
	return !!data;
}