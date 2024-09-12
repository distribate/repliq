"use server"

import "server-only"
import { createClient } from "@repo/lib/utils/supabase/server.ts";

export const getUserByNicknameByAUTH = async(nickname: string) => {
	const supabase = createClient();
	
	return supabase
	.from("AUTH")
	.select("NICKNAME,UUID")
	.eq("NICKNAME", nickname)
	.single();
}

export const getUserByNicknameByUSERS = async(nickname: string) => {
	const supabase = createClient();
	
	return supabase
	.from("users")
	.select("nickname,id")
	.eq("nickname", nickname)
	.single();
}