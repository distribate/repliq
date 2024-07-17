"use server"

import { validateRequest } from "../utils/auth/validate-requests.ts";

type ProtectPrivateArea = {
	requestedUserNickname: string
}

export async function protectPrivateArea({
	requestedUserNickname
}: ProtectPrivateArea): Promise<boolean> {
	const { user } = await validateRequest();
	
	if (!user) return false;
	
	return user.nickname === requestedUserNickname;
}