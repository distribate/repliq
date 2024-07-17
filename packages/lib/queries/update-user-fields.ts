"use server"

import { createClient } from "../utils/supabase/server.ts";
import { getCurrentUser } from '../actions/get-current-user.ts';
import { AvailableFields } from '../hooks/use-update-current-user.ts';
import { getUserDonate } from '@repo/components/src/user/components/donate/queries/get-user-donate.ts';
import { keysForCheckDonate } from '@repo/shared/constants/user-fields-donated.ts';

type UpdateUserFields = {
	nickname: string,
	id: string,
	field: {
		[key in keyof AvailableFields]?: string | null;
	};
}

export async function updateUserFields({
	field, nickname, id
}: UpdateUserFields) {
	const supabase = createClient();
	
	const currentUser = await getCurrentUser()

	if (!currentUser) return
	
	let isAccess: boolean = true;
	
	for (const key of keysForCheckDonate) {
		if (key in field) {
			if (key === "name_color") {
				const donate = await getUserDonate({
					nickname: currentUser.nickname
				});
				
				if (!donate) return;
				
				if (donate === 'default') {
					isAccess = false;
					break;
				}
			}
		}
	}
	
	if (!isAccess) return;
	
	const fields = Object.keys(field).join(",");
	
	const updateFields = Object.entries(field).reduce((acc, [ key, value ]) => {
		acc[key] = value;
		return acc;
	}, {} as {
		[key: string]: string | null
	});
	
	try {
		const { data, error, status } = await supabase
		.from("users")
		.update(updateFields)
		.eq("nickname", nickname)
		.eq("id", id)
		.select(fields)
		
		if (error) console.error(error.message)
		
		return { data, status }
	} catch (e) {
		console.error(e);
		throw e;
	}
}