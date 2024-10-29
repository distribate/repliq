"use server"

import { createClient } from "@repo/lib/utils/api/server.ts";
import { getCurrentUser } from "../actions/get-current-user.ts";
import { validateRequest } from "../utils/auth/validate-requests.ts";

export const getUserActiveSessions = async() => {
	const api = createClient();
	const currentUser = await getCurrentUser();
	
	if (!currentUser) return;
	
	const { session: currentSession } = await validateRequest();
	
	if (!currentSession) return null;
	
	let query = api
	.from("users_session")
	.select("id, user_id, browser, os, isBot, ua, cpu")
	
	const { data, error } = await query
		.eq("user_id", currentUser.id)
	
	if (error) {
		throw new Error(error.message)
	}
	
	return data.map(session => ({
		...session,
		current: currentSession.id === session.id
	}))
}