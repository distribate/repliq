import { keepPreviousData, QueryKey, useQuery } from "@tanstack/react-query";
import { getUserInformation } from "./get-user-information.ts";
import { USER } from "@repo/types/entities/entities-type.ts"
import { DonateType } from "@repo/components/src/user/components/donate/queries/get-user-donate.ts";

export const CURRENT_USER_QUERY_KEY: QueryKey = ["user", "current"]

export type CurrentUser = Omit<USER, "created_at"
	| "uuid"
	| "acceptrules"
> & {
	donate: DonateType["primary_group"] | null
}

export const currentUserQuery = () => {
	return useQuery<CurrentUser, Error>({
		queryKey: CURRENT_USER_QUERY_KEY,
		queryFn: () => getUserInformation(),
		placeholderData: keepPreviousData
	})
}