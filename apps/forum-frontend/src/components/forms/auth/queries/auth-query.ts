import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { AuthMessages } from "../types/error-message-type.ts";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";

export type AuthGlobalOptionsQuery = {
  passwordVisibility: "password" | "text";
  detailsVisibility: "hidden" | "visible";
}

export type AuthQuery = {
  status?: AuthMessages;
  token: string;
  nickname: string;
  password: string;
  findout: string;
  acceptRules: boolean;
  realName: string;
  referrer?: string;
};

export const AUTH_QUERY_KEY = createQueryKey("ui", ["auth-state"])

export const authQuery = () => useQuery<AuthQuery, Error>({
  queryKey: AUTH_QUERY_KEY,
  gcTime: Infinity,
  staleTime: Infinity,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
});

export const AUTH_TYPE_QUERY_KEY = createQueryKey('ui', ['auth-type'])

export const authTypeQuery = () => useQuery({
  queryKey: AUTH_TYPE_QUERY_KEY,
  initialData: 'register',
  gcTime: Infinity,
  staleTime: Infinity,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
})

export const AUTH_GLOBAL_OPTIONS_QUERY_KEY = createQueryKey('ui', ['auth-global-options'])

export const authGlobalOptionsQuery = () => useSuspenseQuery<AuthGlobalOptionsQuery, Error>({
  queryKey: AUTH_GLOBAL_OPTIONS_QUERY_KEY,
  initialData: { passwordVisibility: "password", detailsVisibility: "visible" },
  gcTime: Infinity,
  staleTime: Infinity,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
})