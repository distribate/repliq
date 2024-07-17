"use client"

import { createClient } from "../../supabase/client.ts";
import { useQueryClient } from "@tanstack/react-query";
import { RealtimePostgresChangesPayload } from "@supabase/realtime-js";
import { Tables } from "@repo/types/entities/supabase.ts"
import { toast } from "@repo/ui/src/hooks/use-toast.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import {
	USER_ACTIVE_SESSIONS_QUERY_KEY
} from "@repo/components/src/cards/components/user-personal-card/components/account-settings/queries/user-sessions-query.ts";

type CredentialsSubscription = {
	user_id: string
}

type CredentialsPayload = Tables<"users_session">

export const credentialsSubscription = ({
	user_id
}: CredentialsSubscription) => {
	const supabase = createClient()
	const queryClient = useQueryClient();
	
	const handleNotifyAboutFriendDeleted = (
		payload: RealtimePostgresChangesPayload<CredentialsPayload>
	) => {
		if (payload.eventType === 'INSERT') {
			toast({
				title: `Новое уведомление.`,
				description: (
					<div className="flex gap-1 items-center">
						<Typography>
							В ваш аккаунт кто-то вошёл...
						</Typography>
					</div>
				)
			})
			
			queryClient.invalidateQueries({
				queryKey: USER_ACTIVE_SESSIONS_QUERY_KEY
			})
		}
	}
	
	supabase.channel('credentials_subscription')
	.on('postgres_changes', {
		event: 'INSERT',
		schema: 'public',
		table: 'users_session',
		filter: `user_id=eq.${user_id}`
	}, handleNotifyAboutFriendDeleted).subscribe()
}