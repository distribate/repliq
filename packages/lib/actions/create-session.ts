"use server"

import "server-only"
import { cookies } from "next/headers"
import { redirect } from 'next/navigation';
import { lucia } from "@repo/lib/utils/auth/lucia-instance.ts";
import bcrypt from "bcryptjs";
import { setSessionDeviceInfo } from "./set-session-device-info.ts";
import { USER_URL } from '@repo/shared/constants/routes.ts';
import { getUserFromAuthData } from '#queries/get-user-from-auth-data.ts';

export interface ActionResult {
	error: string | null;
}

type SessionAction = {
	nickname: string,
	id: string,
	password: string,
}

export async function getAuthCredentials(nickname: string) {
	const res = await getUserFromAuthData(nickname)
	
	if (!res.ok) {
		throw new Error(res.statusText)
	}
	
	const user = await res.json()
	
	return user.data
}

export async function createSessionAction({
	nickname, id, password
}: SessionAction): Promise<ActionResult | null> {
	const existingUser = await getAuthCredentials(nickname);
	
	if (!existingUser) return {
		error: "Incorrect password or nickname"
	}
	
	const validPassword = bcrypt.compareSync(
		password, existingUser.HASH
	);
	
	if (!validPassword) {
		return { error: "Incorrect username or password" }
	}
	
	const session = await lucia.createSession(id, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	
	await setSessionDeviceInfo(id, session.id)
	
	cookies().set(
		sessionCookie.name, sessionCookie.value, sessionCookie.attributes
	);
	
	redirect(USER_URL + existingUser.NICKNAME);
}