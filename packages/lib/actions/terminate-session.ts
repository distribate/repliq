// "use server"
//
// import "server-only"
// import { createClient } from "#utils/api/supabase-client.ts";
// import { getCurrentUser } from '#actions/get-current-user.ts';
// import { UsersSessionEntity } from '@repo/types/entities/entities-type.ts';
// import { validateRequests } from '#actions/validate-requests.ts';
//
// export type TerminateSession = Pick<UsersSessionEntity, "user_id" | "uuid">
//
// export async function terminateAllSessions() {
// 	const currentUser = await getCurrentUser()
// 	if (!currentUser) return;
//
// 	const api = createClient();
//
// 	const { user, session: currentSession } = await validateRequests();
//
// 	if (!user || !currentSession) return;
// 	if (user.id !== currentUser.id) return;
//
// 	const { data: allActiveSessions } = await api
// 	.from("users_session")
// 	.select()
// 	.neq("id", currentSession.id)
// 	.eq("user_id", currentUser.id)
// 	.returns<UsersSessionEntity[]>()
//
// 	if (!allActiveSessions) return;
//
// 	let allSuccess = true;
//
// 	for (const session of allActiveSessions) {
// 		const { error } = await api
// 		.from("users_session")
// 		.delete()
// 		.eq("uuid", session.uuid)
// 		.eq("user_id", currentUser.id)
//
// 		if (error) {
// 			console.error(`Error deleting session ${session.uuid}:`, error);
// 			allSuccess = false;
// 		}
// 	}
//
// 	console.log(allSuccess)
//
// 	if (allSuccess) {
// 		return allSuccess;
// 	} else {
// 		allSuccess = false;
// 		return allSuccess;
// 	}
// }
//
// export async function terminateSession({
// 	uuid
// }: Pick<TerminateSession, "uuid">) {
// 	const { user } = await validateRequest();
// 	if (!user) return;
//
// 	const currentUser = await getCurrentUser()
// 	if (!currentUser) return;
//
// 	const api = createClient()
//
// 	const { error } = await api
// 	.from("users_session")
// 	.delete()
// 	.eq("uuid", uuid)
// 	.eq("user_id", currentUser.id)
//
// 	if (error) {
// 		throw new Error(error.message);
// 	}
//
// 	return !!error;
// }
