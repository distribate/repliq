import { z } from "zod";
import { authorizationSchema, registrationSchema } from "../schemas/authorization-schema.ts";

export type AuthMessages = "notfound"
	| "incorrectpass"
	| "something"
	| "created"
	| "alreadyServer"
	| "alreadyUsers"
	| null;

export interface ErrorMessageMap {
	notfound: string;
	incorrectpass: string;
	something: string;
	created: string,
	alreadyServer: string,
	alreadyUsers: string
}

export type zodSignInForm = z.infer<typeof authorizationSchema>
export type zodSignUpForm = z.infer<typeof registrationSchema>