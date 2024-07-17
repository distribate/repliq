"use server"

import { createClient } from "../utils/supabase/server.ts";

export async function getAuthCredentials(nickname: string) {
	const supabase = createClient();
	
	return supabase
	.from("AUTH")
	.select("HASH,NICKNAME")
	.eq("NICKNAME", nickname)
	.single();
}