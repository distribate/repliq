"use server"

import { USER } from "@repo/types/entities/entities-type.ts"
import { createClient } from "../utils/supabase/server.ts";

type AdditionalCredentials = Pick<USER, "nickname"> & Partial<{
	findout?: string
}> & Partial<Pick<USER, "real_name">>

export async function createUserAdditionalCredentials({
	nickname, real_name, findout
}: AdditionalCredentials) {
	const supabase = createClient();
	
	if (!nickname) return;
	
	if (findout) {
		const { data, error } = await supabase
		.from("info_findout")
		.insert({
			user_nickname: nickname, findout
		})
		.select()
		
		if (error) return null;
		
		return data;
	}
	
	if (real_name) {
		const { data, error } = await supabase
		.from("users")
		.update({ real_name })
		.eq("nickname", nickname)
		.select()
		
		if (error) return null;
		
		return data;
	}
	
	return;
}