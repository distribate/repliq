"use server"

import { createClient } from "../utils/supabase/server.ts";
import { getCurrentUser } from "../actions/get-current-user.ts";
import { DonateType, getUserDonate } from "@repo/components/src/user/components/donate/queries/get-user-donate.ts";
import { convertUserPreferencesToObject, UserPreferences } from '../helpers/convert-user-preferences-to-map.ts';

export async function getUserInformation() {
	const supabase = createClient();
	
	const currentUser = await getCurrentUser();

	const { data, error } = await supabase
	.from("users")
	.select(`
		id,
		nickname,
		description,
		status,
		birthday,
		real_name,
		preferences,
		cover_image,
		visibility,
		name_color,
		favorite_item
	`)
	.eq("nickname", currentUser?.nickname)
	.eq("id", currentUser?.id)
	.single()
	
	const donate = await getUserDonate({
		nickname: currentUser?.nickname
	})
	
	let userDonate: DonateType["primary_group"] | null = null;
	
	if (donate) userDonate = donate;
	if (error) throw error;
	
	return {
		...data,
		preferences: convertUserPreferencesToObject(data.preferences) as UserPreferences,
		donate: userDonate
	};
}