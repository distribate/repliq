import { ReactNode } from "react";

type NotificationProviderProps = {
	children: ReactNode,
	nickname: string,
	user_id: string
}

export const NotificationProvider = ({
	children, nickname, user_id
}: NotificationProviderProps) => {
	// friendsSubscribeEvents(nickname);
	// credentialsSubscription(user_id)
	
	return children
}