import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getUserInformation } from './get-user-information.ts';
import { createQueryKey } from '#helpers/query-key-builder.ts';
import type { UserDetailed } from '@repo/types/entities/user-type.ts';
import { REQUESTED_USER_QUERY_KEY } from '@repo/components/src/profile/components/cover/queries/requested-user-query.ts';

export const CURRENT_USER_QUERY_KEY = createQueryKey("user", ["current"])

export const currentUserQuery = () => {
  const qc = useQueryClient()

  return useSuspenseQuery<UserDetailed>({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: async () => {
      const res = await getUserInformation()

      qc.setQueryData(REQUESTED_USER_QUERY_KEY(res.nickname), res);
      
      return res;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false
  })
}