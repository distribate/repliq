"use server"

import { createClient } from "@repo/lib/utils/supabase/server.ts";

function getRandomArbitrary(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

export async function getRandomMinecraftFact() {
	const supabase = createClient();
	
	const randomId = getRandomArbitrary(1, 97);
	
	const { data, error } = await supabase
	.from("config_minecraft_facts")
	.select("fact")
	.eq("id", Math.floor(randomId))
	.single()
	
	if (error) {
		return null;
	}
	
	return data;
}