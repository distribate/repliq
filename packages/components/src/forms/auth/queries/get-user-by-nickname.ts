"use server"

import "server-only"
import { createClient } from '@repo/lib/utils/api/server.ts';
import { getUserFromAuthData } from '@repo/lib/queries/get-user-from-auth-data.ts';

export const findPlayerFromServerData = async (nickname: string): Promise<boolean> => {
	const res = await getUserFromAuthData(nickname)
	
	if (!res.ok) {
		throw new Error(res.statusText)
	}
	
	const user = await res.json()
	
	return user.data !== null;
}

export const getUserFromForumAuthDetails = async(nickname: string) => {
	const api = createClient();
	
	const { data, error } = await api
	.from("users")
	.select("nickname,id")
	.eq("nickname", nickname)
	.single();
	
	if (error) return null;
	
	return data;
}