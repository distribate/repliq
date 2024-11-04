"use server"

import { validateRequest } from "../utils/auth/validate-requests.ts";

export async function protectPrivateArea(requestedUserNickname: string): Promise<boolean> {
	const { user } = await validateRequest();
	if (!user) return false;
	
	return user.nickname === requestedUserNickname;
}