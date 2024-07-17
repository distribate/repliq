"use client"

import { ReactNode } from "react";
import { friendsSubscribeEvents } from "../utils/realtime/subscriptions/friends-subscription.tsx";
import { credentialsSubscription } from "../utils/realtime/subscriptions/credentials-subscription.tsx";

type NotificationProviderProps = {
	children: ReactNode,
	nickname: string,
	user_id: string
}

export const NotificationProvider = ({
	children, nickname, user_id
}: NotificationProviderProps) => {
	friendsSubscribeEvents({
		currentUserNickname: nickname
	});
	
	credentialsSubscription({
		user_id: user_id
	})
	
	return children
}