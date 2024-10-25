"use server"

import "server-only"
import { UserEntity } from "@repo/types/entities/entities-type.ts"
import { createClient } from "../utils/supabase/server.ts";

type AdditionalCredentials = Pick<UserEntity, "nickname"> & Partial<{
	findout?: string
}> & Partial<Pick<UserEntity, "real_name">>

export async function createUserAdditionalCredentials({
	nickname, real_name, findout
}: AdditionalCredentials) {
	if (!nickname) return;
	
	const supabase = createClient();
	
	if (findout) {
		const { data, error } = await supabase
		.from("info_findout")
		.insert({ user_nickname: nickname, findout })
		.select()
		
		if (error) {
			return null;
		}
		
		return data;
	}
	
	if (real_name) {
		const { data, error } = await supabase
		.from("users")
		.update({ real_name })
		.eq("nickname", nickname)
		.select()
		
		if (error) {
			return null;
		}
		
		return data;
	}
}