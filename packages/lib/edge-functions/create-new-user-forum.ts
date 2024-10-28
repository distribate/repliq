"use server"

import "server-only"
import { createClient } from '../utils/api/server.ts';

type UserDetails = {
	nickname: string,
	password: string,
}

export async function createNewUserInForum({
	nickname, password
}: UserDetails) {
	const api = createClient()
	return api.rpc('check_and_insert_user', { nick: nickname, pass: password });
}