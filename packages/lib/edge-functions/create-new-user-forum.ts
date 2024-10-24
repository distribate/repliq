"use server"

import "server-only"
import { createClient } from "../utils/supabase/server.ts";

type UserDetails = {
	nickname: string,
	password: string,
}

export async function createNewUserInForum({
	nickname, password
}: UserDetails) {
	const supabase = createClient()
	
	return supabase.rpc('check_and_insert_user', { nick: nickname, pass: password });
}