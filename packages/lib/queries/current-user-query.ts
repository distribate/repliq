import { keepPreviousData, QueryKey, useQuery } from "@tanstack/react-query";
import { getUserInformation } from "./get-user-information.ts";
import { USER } from "@repo/types/entities/entities-type.ts"
import { DonateType } from "@repo/components/src/user/components/donate/queries/get-user-donate.ts";
import { UserPreferences } from '../helpers/convert-user-preferences-to-map.ts';

export const CURRENT_USER_QUERY_KEY: QueryKey = ["user", "current"]

export type CurrentUser = Omit<USER, "preferences"
	| "visibility"
	| "cover_image"
	| "acceptrules"
> & {
	donate: DonateType["primary_group"] | null,
	properties: {
		preferences: UserPreferences,
		visibility: Pick<USER, "visibility">["visibility"],
		cover_image: Pick<USER, 'cover_image'>["cover_image"]
	}
}

export const currentUserQuery = () => {
	return useQuery<CurrentUser | null, Error>({
		queryKey: CURRENT_USER_QUERY_KEY,
		queryFn: () => getUserInformation(),
		placeholderData: keepPreviousData
	})
}