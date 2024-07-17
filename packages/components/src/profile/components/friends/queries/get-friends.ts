"use server"

import { createClient } from "@repo/lib/utils/supabase/server.ts";
import { FriendsSort } from "../hooks/use-friends-sort.tsx";

export type RequestFriends = {
	nickname?: string,
	orderType?: FriendsSort,
	ascending?: boolean
}

export async function getFriends({
	nickname, orderType, ascending = false
}: RequestFriends) {
	const supabase = createClient();
	
	const { data: friendsData, error: friendsError } = await supabase
	.from("users_friends")
	.select(`
		user_1,
		user_2,
	  created_at
	`)
	.or(`user_1.eq.${nickname},user_2.eq.${nickname}`)
	
	if (friendsError) throw new Error(
		`Error fetching friends: ${friendsError.message}`
	);
	
	const friendNicknames = new Set<string>();
	
	friendsData.forEach(({ user_1, user_2 }) => {
		if (user_1 !== nickname) friendNicknames.add(user_1);
		if (user_2 !== nickname) friendNicknames.add(user_2);
	});
	
	let query = supabase
	.from("users")
	.select(`
		nickname,
	  description,
	  status,
	  name_color
	`)
	.in("nickname", Array.from(friendNicknames));
	
	// !!
	// impl friends list sort (donate sort)
	// if (orderType === 'donate') {
	// 	query.order("donate_weight", {
	// 		ascending: ascending
	// 	})
	// }
	
	const { data: friendsDetailed, error: userError } = await query;
	
	if (userError) throw new Error(
		`Error fetching user details: ${userError.message}`
	);
	
	return friendsDetailed;
}