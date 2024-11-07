"use server"

import "server-only"
import { createClient } from "@repo/lib/utils/api/server.ts";

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
	const api = createClient();
	
	const { error } = await api
	.from("users_security")
	.insert({ user_nickname: nickname, email, token })
	
	return !error;
}