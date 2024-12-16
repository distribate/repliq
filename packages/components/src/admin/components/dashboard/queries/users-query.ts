import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { GetUsers, getUsers } from './get-users.ts';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';

export const ADMIN_USERS_QUERY_KEY = createQueryKey("ui", ["admin", "users"])

type UsersQuery = GetUsers;

export const usersQuery = (filters: UsersQuery) => useQuery({
  queryKey: ADMIN_USERS_QUERY_KEY,
  queryFn: () => getUsers(filters),
  refetchOnWindowFocus: false,
  placeholderData: keepPreviousData,
});