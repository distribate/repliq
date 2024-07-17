import { useQuery } from "@tanstack/react-query";
import { AuthMessages } from "../types/error-message-type.ts";

type AuthType = "signin" | "signup";

export type AuthQuery = {
	type?: AuthType,
	formState?: {
		error: AuthMessages | null,
		status: number | null
	},
	values?: {
		nickname: string,
		password: string,
		email?: string,
		findout?: string,
		acceptRules?: boolean
	}
}

const initial: AuthQuery = {
	formState: {
		error: null,
		status: null
	}
}

export const AUTH_QUERY_KEY = [ "ui", "auth-state" ]

export const authQuery = () => {
	return useQuery<AuthQuery, Error>({
		queryKey: AUTH_QUERY_KEY,
		gcTime: Infinity,
		staleTime: Infinity,
		initialData: initial,
		refetchOnWindowFocus: false
	})
}