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