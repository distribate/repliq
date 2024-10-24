"use server"

import "server-only"
import { createClient } from "../utils/supabase/server.ts";

export type SecurityCredentials = Partial<{
	email: string,
	token: string
}>

type CreateUserSecurityCredentials = {
	nickname: string
} & SecurityCredentials

export async function createUserSecurityCredentials({
	nickname, email, token
}: CreateUserSecurityCredentials) {
	const supabase = createClient();
	
	const { data, error, status } = await supabase
	.from("users_security")
	.insert({ user_nickname: nickname, email, token })
	.single()
	
	if (error) {
		return null;
	}
	
	return true;
}