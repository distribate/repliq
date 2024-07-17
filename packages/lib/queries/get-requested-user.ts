"use server"

import { USER } from "@repo/types/entities/entities-type.ts"
import { createClient } from "../utils/supabase/server.ts";
import { getCurrentUser } from "../actions/get-current-user.ts";
import { REDIRECT_USER_NOT_EXIST } from "@repo/shared/constants/routes.ts";

type RequestedUserProps = {
	nickname?: string,
}

type RequestedUser = USER & {
	primary_group: string
}

export async function getRequestedUser({
	nickname
}: RequestedUserProps): Promise<RequestedUser | string> {
	const supabase = createClient()
	
	const currentUser = await getCurrentUser()
	
	let requestedUser: RequestedUser | null = null;
	
	const { data: donate, error: donateError } = await supabase
		.from("luckperms_players")
		.select("primary_group")
		.eq("username", nickname)
		.single()
	
	const { data, error } = await supabase
	.from("users")
	.select()
	.eq("nickname", nickname)
	.returns<USER[]>()
	.single()
	
	if (!donate || error || !data) {
		if (currentUser) {
			return `${REDIRECT_USER_NOT_EXIST}${currentUser.nickname}&timeout=5`
		}
		
		return `/not-found`
	}
	
	requestedUser = {
		...data,
		primary_group: donate.primary_group
	}
	
	return requestedUser;
}