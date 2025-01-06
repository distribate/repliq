import { useSuspenseQuery } from '@tanstack/react-query';
import { getUserInformation } from './get-user-information.ts';
import { createQueryKey } from '#helpers/query-key-builder.ts';
import type { UserDetailed } from '@repo/types/entities/user-type.ts';

export const CURRENT_USER_QUERY_KEY = createQueryKey("user", ["current"])

export const currentUserQuery = () => useSuspenseQuery<UserDetailed>({
  queryKey: CURRENT_USER_QUERY_KEY,
  queryFn: () => getUserInformation(),
  refetchOnMount: false
});