import { createClient } from "../../supabase/server.ts";
import { RealtimePostgresChangesPayload } from "@supabase/realtime-js";
import { Tables } from "@repo/types/entities/supabase.ts"
import { toast } from "@repo/ui/src/hooks/use-toast.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";

type CredentialsPayload = Tables<"users_session">
type CredentialsSubType<T extends { [key: string]: any }> = RealtimePostgresChangesPayload<T>

export const credentialsSubscription = (user_id: string) => {
	const supabase = createClient()

	const handleNotifyAboutFriendDeleted = (pd: CredentialsSubType<CredentialsPayload>) => {
		if (pd.eventType === 'INSERT') {
			toast({
				title: `Новое уведомление.`,
				description: (
					<div className="flex gap-1 items-center">
						<Typography>В ваш аккаунт кто-то вошёл...</Typography>
					</div>
				)
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