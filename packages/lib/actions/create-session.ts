"use server"

import { cookies } from "next/headers"
import { permanentRedirect } from "next/navigation"
import { lucia } from "@repo/lib/utils/auth/lucia-instance.ts";
import bcrypt from "bcryptjs";
import { setSessionDeviceInfo } from "./set-session-device-info.ts";
import { getAuthCredentials } from "../queries/get-auth-credentials.ts";

export interface ActionResult {
	error: string | null;
}

type SessionAction = {
	nickname: string,
	id: string,
	password: string,
}

export async function createSessionAction({
	nickname, id, password
}: SessionAction): Promise<ActionResult | null> {
	const existingUser = await getAuthCredentials(
		nickname
	);
	
	if (!existingUser.data) return {
		error: "Incorrect password or nickname"
	}
	
	const validPassword = bcrypt.compareSync(
		password, existingUser.data.HASH
	);
	
	if (!validPassword) {
		return {
			error: "Incorrect username or password"
		}
	}
	
	const session = await lucia.createSession(id, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	
	await setSessionDeviceInfo(id, session.id)
	
	cookies().set(
		sessionCookie.name, sessionCookie.value, sessionCookie.attributes
	);
	
	permanentRedirect(`/user/` + existingUser.data.NICKNAME);
}