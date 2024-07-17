"use server"

import { createClient } from "@repo/lib/utils/supabase/server.ts";

export type RequestProperties = {
	initiator: string,
	recipient: string
}

async function deleteRequest({
	initiator, recipient
}: RequestProperties) {
	const supabase = createClient();
	
	return supabase
		.from("friends_requests")
		.delete()
		.eq("recipient", recipient)
		.eq("initiator", initiator)
}

export { deleteRequest }