import { useQuery } from '@tanstack/react-query';
import { getUsers } from './get-users.ts';

export const ADMIN_USERS_QUERY_KEY = ["admin", "users"]

export const usersQuery = () => useQuery({
  queryKey: ADMIN_USERS_QUERY_KEY,
  queryFn: () => getUsers()
})