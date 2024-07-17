"use server"

import { createClient } from "../utils/supabase/server.ts";
import { getCurrentUser } from "../actions/get-current-user.ts";
import { validateRequest } from "../utils/auth/validate-requests.ts";

export const getUserActiveSessions = async() => {
	const supabase = createClient();
	
	const currentUser = await getCurrentUser();
	
	const { session: currentSession } = await validateRequest();
	
	let query = supabase
	.from("users_session")
	.select("id, user_id, browser, os, isBot, ua, cpu")
	
	if (!currentUser || !currentSession) return null;
	
	const { data, error } = await query
		.eq("user_id", currentUser.id)
	
	if (error) throw error;
	
	return data.map(session => ({
		...session,
		current: currentSession.id === session.id
	}))
}