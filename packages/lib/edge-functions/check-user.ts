"use server"

import { createClient } from "../utils/supabase/server.ts";

type CheckAndAddUserDB = {
	nickname: string,
	password: string,
}

export async function checkServerAuthCredentials({
	nickname, password
}: CheckAndAddUserDB) {
	const supabase = createClient()
	
	return supabase
	.rpc('check_and_insert_user', {
		nick: nickname,
		pass: password
	});
}