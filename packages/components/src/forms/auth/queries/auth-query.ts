import { useQuery } from '@tanstack/react-query';
import { AuthMessages } from '../types/error-message-type.ts';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';

type AuthType = 'sign-in' | 'sign-up';

export type AuthQuery = {
  type: AuthType,
  formState: {
    error: AuthMessages | null,
    status: number | null
  },
  values: {
    nickname: string,
    password: string,
    email?: string,
    findout?: string,
    acceptRules?: boolean
  } | null
}

const initial: AuthQuery = {
  formState: { error: null, status: null, },
  values: null,
  type: "sign-up"
};

export const AUTH_QUERY_KEY = createQueryKey('ui', [ 'auth-state' ]);

export const authQuery = () => useQuery<AuthQuery, Error>({
  queryKey: AUTH_QUERY_KEY,
  gcTime: Infinity,
  staleTime: Infinity,
  initialData: initial,
  refetchOnWindowFocus: false
});