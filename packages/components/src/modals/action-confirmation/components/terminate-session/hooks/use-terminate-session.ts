import { useMutation, useQueryClient } from "@tanstack/react-query";
import { terminateAllSessions, TerminateSession, terminateSession } from "@repo/lib/actions/terminate-session.ts";
import { currentUserQuery } from "@repo/lib/queries/current-user-query.ts";
import {
	USER_ACTIVE_SESSIONS_QUERY_KEY
} from "../../../../../cards/components/user-personal-card/components/account-settings/queries/user-sessions-query.ts";
import { permanentRedirect, RedirectType } from "next/navigation"

type TerminateSessionMutation = {
	values?: Pick<TerminateSession, "session_id">,
	type?: "single" | "all"
}

export const useTerminateSession = () => {
	const queryClient = useQueryClient()
	
	const { data: currentUser } = currentUserQuery()
	
	const terminateMutation = useMutation({
			mutationFn: async({
				values, type
			}: TerminateSessionMutation) => {
				if (!currentUser || !type) return;
				
				if (type === 'single' && values && values.session_id) {
					console.log(values.session_id)
					
					return terminateSession({
						session_id: values.session_id
					})
				}
				
				return terminateAllSessions({
					user_id: currentUser.id
				})
			},
			onSuccess:
				async(data, variables) => {
					if (!variables.type || !variables.values || !data) return;
					
					await queryClient.invalidateQueries({
						queryKey: USER_ACTIVE_SESSIONS_QUERY_KEY
					})
					
					if (variables.type === 'single' && !Array.isArray(data)) {
						if (data.id === variables.values.session_id) {
							permanentRedirect(
								"/auth",
								RedirectType.push
							)
						}
					}
				},
			onError:
				(e) => {
					console.error(e)
					throw e;
				}
		}
	)
	
	return { terminateMutation }
}