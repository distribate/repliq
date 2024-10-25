"use server"

import "server-only"
import { createClient } from '@repo/lib/utils/supabase/server.ts';

export async function getThreadsUser(
	nickname: string
) {
	const api = createClient();
	
	const { data, error } = await api
	.from("threads_users")
	.select(`thread_id, threads(
		id,	title, description,comments, created_at)`
	)
	.eq("user_nickname", nickname)
	.order("created_at", {
		referencedTable: "threads",
		ascending: false
	})
	
	if (error) {
		throw new Error(error.message);
	}

	return data.flatMap(item => item.threads)
}