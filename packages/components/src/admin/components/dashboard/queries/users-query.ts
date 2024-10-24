import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { GetUsers, getUsers } from './get-users.ts';

export const ADMIN_USERS_QUERY_KEY = ["admin", "users"]

type UsersQuery = GetUsers

export const usersQuery = (filters: UsersQuery) => useQuery({
  queryKey: ADMIN_USERS_QUERY_KEY,
  queryFn: () => getUsers(filters),
  refetchOnWindowFocus: false,
  placeholderData: keepPreviousData,
  retry: 1
})