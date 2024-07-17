"use server"

import { ActionResult } from "./create-session.ts";
import { validateRequest } from "../utils/auth/validate-requests.ts";
import { lucia } from "../utils/auth/lucia-instance.ts";
import { cookies } from "next/headers";
import { permanentRedirect } from "next/navigation";

export async function deleteSession(): Promise<ActionResult> {
	const { session } = await validateRequest();

	if (!session) {
		return {
			error: "Unauthorized..."
		};
	}

	await lucia.invalidateSession(session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	
	cookies().set(
		sessionCookie.name, sessionCookie.value, sessionCookie.attributes
	);

	permanentRedirect("/auth");
}