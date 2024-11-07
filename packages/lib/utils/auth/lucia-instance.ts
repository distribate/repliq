import { Lucia, TimeSpan  } from "lucia";
import { adapter } from "./postgre-adapter.ts";

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		expires: false,
		attributes: {
			secure: process.env.NODE_ENV === "production"
		}
	},
	sessionExpiresIn: new TimeSpan(2, "w"), // 2 weeks
	getUserAttributes: (attributes) => {
		return {
			id: attributes.id,
			nickname: attributes.nickname,
			setupTwoFactor: attributes.two_factor_secret !== null
		};
	},
	getSessionAttributes: (attributes) => {
		return {
			// @ts-ignore
			uuid: attributes.uuid
		}
	}
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes
	}
}

interface DatabaseUserAttributes {
	id: string,
	nickname: string,
	two_factor_secret: string | null;
}
