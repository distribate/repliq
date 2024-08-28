"use server"

import { createClient } from "@repo/lib/utils/supabase/server.ts";

export async function getThreadsUser(
	nickname: string
) {
	const supabase = createClient();
	
	const { data, error } = await supabase
	.from("threads_users")
	.select(`thread_id, threads(
		id,	title, description,comments, created_at)`
	)
	.eq("user_nickname", nickname)
	.order("created_at", {
		referencedTable: "threads",
		ascending: false
	})
	
	if (error) throw new Error(error.message)

	return data.flatMap(item => item.threads)
}