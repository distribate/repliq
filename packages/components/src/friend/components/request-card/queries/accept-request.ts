"use server"

import { createClient } from "@repo/lib/utils/supabase/server.ts";
import { deleteRequest, RequestProperties } from "./reject-request.ts";

async function addFieldToFields({
	recipient, initiator
}: RequestProperties) {
	const supabase = createClient();
	
	return supabase
	.from("users_friends")
	.insert({
		user_1: initiator,
		user_2: recipient
	})
}

export async function acceptRequest({
	recipient, initiator
}: RequestProperties) {
	const [ deleted, added ] = await Promise.all([
		deleteRequest({
			initiator: initiator,
			recipient: recipient
		}),
		addFieldToFields({
			recipient: recipient,
			initiator: initiator
		})
	])
	
	return { added }
}