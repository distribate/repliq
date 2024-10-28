"use server"

import "server-only"
import { createClient } from "@repo/lib/utils/api/server.ts";
import { validateRequest } from "../utils/auth/validate-requests.ts";

export type Session = {
	id: string,
	user_id: string,
	browser: string,
	os: string,
	isBot: boolean,
	ua: string,
	cpu: string
}

export type TerminateSession = {
	session_id: string,
	user_id: string
}

export async function terminateAllSessions({
	user_id
}: Pick<TerminateSession, "user_id">) {
	const api = createClient();
	
	const { user, session: currentSession } = await validateRequest();
	
	if (!user || !currentSession) return;
	if (user.id !== user_id) return;
	
	const { data: allActiveSessions } = await api
	.from("users_session")
	.select()
	.neq("id", currentSession.id)
	.returns<Session[]>()
	
	if (!allActiveSessions) return;
	
	for (const session of allActiveSessions) {
		const { data, error } = await api
		.from("users_session")
		.delete()
		.eq("id", session.id)
		.select("id")
		.returns<Pick<Session, "id">>()
		
		if (error) {
			return null;
		}
		
		return data;
	}
}

export async function terminateSession({
	session_id
}: Pick<TerminateSession, "session_id">) {
	const { user } = await validateRequest();
	if (!user) return;
	
	const supabase = createClient()
	
	const { data, error } = await supabase
	.from("users_session")
	.delete()
	.eq("id", session_id)
	.select("id")
	.single()
	
	if (error) {
		throw new Error(error.message);
	}
	
	return data;
}