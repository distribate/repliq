import { useQuery } from "@tanstack/react-query";
import { getRequestedUser } from "./get-requested-user.ts";

export const REQUESTED_USER_QUERY_KEY = (nickname?: string) => {
	return [ "user", "requested", nickname ]
}

export const requestedUserQuery = (nickname?: string) => {
	return useQuery({
		queryKey: REQUESTED_USER_QUERY_KEY(nickname),
		queryFn: () => getRequestedUser({
			nickname: nickname
		})
	})
}