"use server"

import { getRequestsByType } from "./get-requests-by-type.ts";

export async function getIncomingRequests(
	nickname?: string
) {
	const { data, error } = await getRequestsByType({
		nickname: nickname,
		type: "incoming"
	})
	
	if (error) {
		throw new Error(error.message)
	}
	
	return data;
}