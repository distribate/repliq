"use server"

import { createClient } from "@repo/lib/utils/supabase/server.ts";

function getRandomArbitrary(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

export async function getRandomBackground() {
	const supabase = createClient();
	
	const randomId = Math.floor(getRandomArbitrary(1, 10));
	const fileName = `auth_background/${randomId}.png`
	
	const { data, error } = await supabase
	.storage
	.from('static')
	.createSignedUrl(fileName, 60)
	
	if (error) {
		return null;
	}

	return data.signedUrl;
}