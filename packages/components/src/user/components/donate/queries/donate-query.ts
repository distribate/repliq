import { useQuery } from "@tanstack/react-query";
import { getUserDonate } from "./get-user-donate.ts";
import { UserDonate } from "../types/user-donate-types.ts";

export const DONATE_QUERY_KEY = (nickname?: string) => {
	return [ "user", "donate", nickname ]
}

export const donateQuery = ({
	nickname
}: UserDonate) => {
	return useQuery({
		queryKey: DONATE_QUERY_KEY(nickname),
		queryFn: () => getUserDonate({
			nickname
		}),
		refetchOnWindowFocus: false,
		retry: 2
	})
}