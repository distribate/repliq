"use server"

import "server-only"
import { getRequestsByType } from "./get-requests-by-type.ts";

export async function getOutgoingRequests(
	nickname?: string
) {
	const { data, error } = await getRequestsByType({
		nickname: nickname,
		type: "outgoing"
	})
	
	if (error) {
		throw new Error(error.message)
	}
	
	return data;
}