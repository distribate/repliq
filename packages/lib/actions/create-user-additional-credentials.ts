"use server"

import "server-only"
import { UserEntity } from "@repo/types/entities/entities-type.ts"
import { createClient } from "@repo/lib/utils/api/server.ts";

type AdditionalCredentials = Pick<UserEntity, "nickname"> & {
	findout?: string
} & Partial<Pick<UserEntity, "real_name">>

export async function createUserAdditionalCredentials({
	nickname, real_name, findout
}: AdditionalCredentials) {
	const api = createClient();
	
	if (findout) {
		const { error } = await api
		.from("info_findout")
		.insert({ user_nickname: nickname, findout })
		
		if (error) return;
	}
	
	if (real_name) {
		const { error } = await api
		.from("users")
		.update({ real_name })
		.eq("nickname", nickname)
		
		if (error) return;
	}
}