"use client"

import { createClient } from "../../supabase/client.ts";
import { toast } from "@repo/ui/src/hooks/use-toast.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import {
	REQUESTS_INCOMING_QUERY_KEY
} from "@repo/components/src/profile/components/friends/queries/requests-incoming-query.ts";
import { REQUESTS_QUERY_KEY } from "@repo/components/src/profile/components/friends/queries/requests-query.ts";
import {
	REQUESTS_OUTGOING_QUERY_KEY
} from "@repo/components/src/profile/components/friends/queries/requests-outgoing-query.ts";
import { FRIENDS_QUERY_KEY } from "@repo/components/src/profile/components/friends/queries/friends-query.ts";
import { RealtimePostgresChangesPayload } from "@supabase/realtime-js";
import { useQueryClient } from "@tanstack/react-query";
import { Tables } from "@repo/types/entities/supabase.ts"
import { REQUESTED_USER_QUERY_KEY } from "../../../queries/requested-user-query.ts";
import { Avatar } from "@repo/components/src/user/components/avatar/components/avatar.tsx";

type FriendsSubscribe = {
	currentUserNickname?: string
}

type FriendsRequestsTable = Tables<"friends_requests">
type UserFriendsTable = Tables<"users_friends">

export const friendsSubscribeEvents = ({
	currentUserNickname
}: FriendsSubscribe) => {
	const supabase = createClient()
	const queryClient = useQueryClient();
	
	const handleNotifyAboutFriendAccepted = (
		payload: RealtimePostgresChangesPayload<UserFriendsTable>
	) => {
		if (payload.eventType === "INSERT") {
			toast({
				title: `Новое уведомление.`,
				description: (
					<div className="flex gap-1 items-center">
						<Avatar
							propHeight={20}
							propWidth={20}
							nickname={payload.new.user_2}
						/>
						<Typography>
							принял вашу заявку в друзья
						</Typography>
					</div>
				)
			})
			
			
			queryClient.invalidateQueries({
				queryKey: REQUESTED_USER_QUERY_KEY(payload.new.user_1)
			})
			
			queryClient.invalidateQueries({
				queryKey: REQUESTED_USER_QUERY_KEY(payload.new.user_2)
			})
			
			queryClient.invalidateQueries({
				queryKey: REQUESTS_INCOMING_QUERY_KEY(payload.new.user_1)
			})
			
			queryClient.invalidateQueries({
				queryKey: REQUESTS_INCOMING_QUERY_KEY(payload.new.user_2)
			})
			
			queryClient.invalidateQueries({
				queryKey: REQUESTS_QUERY_KEY(payload.new.user_1)
			})
			
			queryClient.invalidateQueries({
				queryKey: REQUESTS_QUERY_KEY(payload.new.user_2)
			})
			
			queryClient.invalidateQueries({
				queryKey: REQUESTS_OUTGOING_QUERY_KEY(payload.new.user_1)
			})
			
			queryClient.invalidateQueries({
				queryKey: REQUESTS_OUTGOING_QUERY_KEY(payload.new.user_2)
			})
			
			queryClient.invalidateQueries({
				queryKey: FRIENDS_QUERY_KEY(payload.new.user_1)
			})
			
			queryClient.invalidateQueries({
				queryKey: FRIENDS_QUERY_KEY(payload.new.user_2)
			})
		}
	}
	
	const handleNotifyAboutFriendRequest = (
		payload: RealtimePostgresChangesPayload<FriendsRequestsTable>
	) => {
		if (payload.eventType === "INSERT") {
			toast({
				title: `Новое уведомление`,
				description: (
					<div className="flex gap-1 items-center">
						<Avatar
							nickname={payload.new.initiator}
							propHeight={20}
							propWidth={20}
						/>
						<Typography className="text-base text-shark-50 font-medium">
							хочет добавить вас в друзья
						</Typography>
					</div>
				)
			})
			
			queryClient.invalidateQueries({
				queryKey: REQUESTS_INCOMING_QUERY_KEY(payload.new.recipient)
			})
			
			queryClient.invalidateQueries({
				queryKey: REQUESTS_INCOMING_QUERY_KEY(payload.new.initiator)
			})
			
			queryClient.invalidateQueries({
				queryKey: REQUESTS_QUERY_KEY(payload.new.recipient)
			})
			
			queryClient.invalidateQueries({
				queryKey: REQUESTS_QUERY_KEY(payload.new.initiator)
			})
			
			queryClient.invalidateQueries({
				queryKey: REQUESTS_OUTGOING_QUERY_KEY(payload.new.recipient)
			})
			
			queryClient.invalidateQueries({
				queryKey: REQUESTS_OUTGOING_QUERY_KEY(payload.new.initiator)
			})
			
			queryClient.invalidateQueries({
				queryKey: FRIENDS_QUERY_KEY(payload.new.recipient)
			})
			
			queryClient.invalidateQueries({
				queryKey: FRIENDS_QUERY_KEY(payload.new.initiator)
			})
		}
	}
	
	const handleNotifyAboutFriendDeleted = (
		payload: RealtimePostgresChangesPayload<UserFriendsTable>
	) => {
		if (payload.eventType === "DELETE") {
			queryClient.invalidateQueries({
				queryKey: REQUESTS_INCOMING_QUERY_KEY(payload.old.user_1)
			})
			
			queryClient.invalidateQueries({
				queryKey: REQUESTED_USER_QUERY_KEY(payload.old.user_1)
			})
			
			queryClient.invalidateQueries({
				queryKey: REQUESTED_USER_QUERY_KEY(payload.old.user_2)
			})
			
			queryClient.invalidateQueries({
				queryKey: REQUESTS_INCOMING_QUERY_KEY(payload.old.user_2)
			})
			
			queryClient.invalidateQueries({
				queryKey: REQUESTS_QUERY_KEY(payload.old.user_1)
			})
			
			queryClient.invalidateQueries({
				queryKey: REQUESTS_QUERY_KEY(payload.old.user_2)
			})
			
			queryClient.invalidateQueries({
				queryKey: REQUESTS_OUTGOING_QUERY_KEY(payload.old.user_1)
			})
			
			queryClient.invalidateQueries({
				queryKey: REQUESTS_OUTGOING_QUERY_KEY(payload.old.user_2)
			})
			
			queryClient.invalidateQueries({
				queryKey: FRIENDS_QUERY_KEY(payload.old.user_1)
			})
			
			queryClient.invalidateQueries({
				queryKey: FRIENDS_QUERY_KEY(payload.old.user_2)
			})
		}
	}
	
	supabase.channel('users_friends')
	.on('postgres_changes', {
		event: 'INSERT',
		schema: 'public',
		table: 'users_friends',
		filter: `user_1=eq.${currentUserNickname}`
	}, handleNotifyAboutFriendAccepted).subscribe()
	
	supabase.channel('friends_requests')
	.on('postgres_changes', {
		event: 'INSERT',
		schema: 'public',
		table: 'friends_requests',
		filter: `recipient=eq.${currentUserNickname}`
	}, handleNotifyAboutFriendRequest).subscribe()
	
	supabase.channel('users_friends')
	.on('postgres_changes', {
		event: 'DELETE',
		schema: 'public',
		table: 'users_friends',
		filter: `user_1=eq.${currentUserNickname}`
	}, handleNotifyAboutFriendDeleted).subscribe()
}