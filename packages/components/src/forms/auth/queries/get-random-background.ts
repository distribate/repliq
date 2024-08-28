"use server"

import { createClient } from "@repo/lib/utils/supabase/server.ts";
import AuthBackground from "@repo/assets/images/auth-background.png"

const getRandomArbitrary = (min: number, max: number) => Math.random() * (max - min) + min;

export async function getRandomBackground() {
	const supabase = createClient();
	const randomId = Math.floor(getRandomArbitrary(1, 10));
	const fileName = `auth_background/${randomId}.png`
	
	const { data, error } = await supabase
	.storage
	.from('static')
	.createSignedUrl(fileName, 60)
	
	if (error || !data) {
		return AuthBackground.src;
	}

	return data.signedUrl;
}