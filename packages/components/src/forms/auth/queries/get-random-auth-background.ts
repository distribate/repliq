"use server"

import AuthBackground from "@repo/assets/images/auth-background.png"
import { getStaticImages } from '@repo/lib/queries/get-static-signed-images.ts';
import { getAuthImagesCount } from '#admin/components/configs/auth-background/queries/get-auth-images-count.ts';
import { getAuthBackgroundImages } from '@repo/lib/queries/get-auth-background-images.ts';

const getRandomArbitrary = (min: number, max: number) =>
	Math.random() * (max - min) + min;

export async function getRandomAuthBackground() {
	const currentAuthImages = await getAuthBackgroundImages();
	if (!currentAuthImages) return AuthBackground.src;
	
	const currentAuthImagesCount = await getAuthImagesCount();
	const randomId = Math.floor(
		getRandomArbitrary(1, currentAuthImagesCount ? currentAuthImagesCount + 1 : 10)
	);
	
	const fileName = 'auth_background' + '/' + currentAuthImages[randomId]?.name;
	if (!fileName) return AuthBackground.src
	
	const data = await getStaticImages({ fileName })
	if (!data) return AuthBackground.src;
	
	return data;
}