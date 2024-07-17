"use server"

import { UserDonate } from "../types/user-donate-types.ts";
import { createClient } from "@repo/lib/utils/supabase/server.ts";
import { Enums } from "@repo/types/entities/supabase.ts";

export type DonateType = {
	primary_group: Enums<"donate_variants">
}

export async function getUserDonate({
	nickname
}: UserDonate) {
	const supabase = createClient();
	
	const { data, error } = await supabase
	.from("luckperms_players")
	.select("primary_group")
	.eq("username", nickname)
	.single()
	
	if (error) return null;
	
	const donate: DonateType["primary_group"] = data.primary_group;
	
	return donate;
}