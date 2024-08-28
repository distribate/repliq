"use server"

import { cookies } from "next/headers";
import type { Session, User } from "lucia";
import { lucia } from "./lucia-instance.ts";
import { cache } from "react";

type ValidateRequestNull = {
	user: null;
	session: null
}

type ValidateRequest = {
	user: User;
	session: Session
}

export const validateRequest = cache(
	async (): Promise<ValidateRequest | ValidateRequestNull> => {
		const sessionId = cookies().get(
			lucia.sessionCookieName
		)?.value ?? null;

		if (!sessionId) {
			return {
				user: null,
				session: null
			};
		}

		const result = await lucia.validateSession(sessionId);
		
		try {
			if (result.session && result.session.fresh) {
				const sessionCookie = lucia.createSessionCookie(result.session.id);
				
				cookies().set(
					sessionCookie.name, sessionCookie.value, sessionCookie.attributes
				);
			}

			if (!result.session) {
				const sessionCookie = lucia.createBlankSessionCookie();
				
				cookies().set(
					sessionCookie.name, sessionCookie.value, sessionCookie.attributes
				);
			}

		} catch {}
		
		return result;
	}
);