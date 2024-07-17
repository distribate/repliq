"use server"

import { createClient } from "../utils/supabase/server.ts";
import { validateRequest } from "../utils/auth/validate-requests.ts";
import { Session } from "@repo/types/entities/entities-type.ts"

export type TerminateSession = {
	session_id: string,
	user_id: string
}

export async function terminateAllSessions({
	user_id
}: Pick<TerminateSession, "user_id">) {
	const supabase = createClient();
	
	const { user, session: currentSession } = await validateRequest();
	
	if (!user || !currentSession) return;
	if (user.id !== user_id) return;
	
	const { data: allActiveSessions } = await supabase
	.from("users_session")
	.select("id, user_id, browser, os, isBot, ua, cpu")
	.neq("id", currentSession.id)
	.returns<Session[]>()
	
	if (!allActiveSessions) return;
	
	for (const session of allActiveSessions) {
		const { data, error } = await supabase
		.from("users_session")
		.delete()
		.eq("id", session.id)
		.select("id")
		.returns<Pick<Session, "id">>()
		
		if (error) return null;
		
		return data;
	}
}

export async function terminateSession({
	session_id
}: Pick<TerminateSession, "session_id">) {
	const supabase = createClient()
	
	const { user } = await validateRequest();

	if (!user) return;

	const { data, error } = await supabase
	.from("users_session")
	.delete()
	.eq("id", session_id)
	.select("id")
	.single()
	
	if (error) throw error;
	
	return data;
}