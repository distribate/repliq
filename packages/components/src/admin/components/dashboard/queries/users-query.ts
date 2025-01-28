import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';

export const ADMIN_USERS_QUERY_KEY = createQueryKey("ui", ["admin", "users"])

export const usersQuery = (filters?: any) => useQuery({
  queryKey: ADMIN_USERS_QUERY_KEY,
  queryFn: () => [],
  refetchOnWindowFocus: false,
  placeholderData: keepPreviousData,
});