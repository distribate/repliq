import { useQuery } from '@tanstack/react-query';
import { checkProfileIsBlocked } from '#helpers/check-profile-is-blocked.ts';

export const BLOCKED_QUERY_KEY = (requestedNickname: string) => ["is-blocked", requestedNickname]

export const blockedUserQuery = (requestedNickname: string) => useQuery({
  queryKey: BLOCKED_QUERY_KEY(requestedNickname),
  queryFn: () => checkProfileIsBlocked(requestedNickname),
  enabled: !!requestedNickname,
  refetchOnWindowFocus: false
})