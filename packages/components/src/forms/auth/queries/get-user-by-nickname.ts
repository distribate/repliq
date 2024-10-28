"use server"

import "server-only"
import { createClient } from '@repo/lib/utils/api/server.ts';

export const getUserFromOriginalAuthDetails = async(nickname: string) => {
	const api = createClient();
	
	return api.from("AUTH").select("NICKNAME,UUID").eq("NICKNAME", nickname).single();
}

export const getUserFromForumAuthDetails = async(nickname: string) => {
	const api = createClient();
	
	return api.from("users").select("nickname,id").eq("nickname", nickname).single();
}