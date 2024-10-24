import { z } from "zod";
import { authorizationSchema, registrationSchema } from "../schemas/authorization-schema.ts";

export type AuthMessages = "notFound"
	| "incorrectPassword"
	| "something"
	| "created"
	| "alreadyOriginal"
	| "alreadyForum"
	| null;

export interface ErrorMessageMap {
	notFound: string;
	incorrectPassword: string;
	something: string;
	created: string,
	alreadyOriginal: string,
	alreadyForum: string
}

export type zodSignInForm = z.infer<typeof authorizationSchema>
export type zodSignUpForm = z.infer<typeof registrationSchema>