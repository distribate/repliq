import { useQuery } from "@tanstack/react-query";
import {
  getRequestedUser,
} from "@repo/lib/queries/get-requested-user.ts";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";
import { useNavigate } from "@tanstack/react-router";
import { REDIRECT_USER_NOT_EXIST } from "@repo/shared/constants/routes";

export const REQUESTED_USER_QUERY_KEY = (nickname: string) =>
  createQueryKey("user", ["requested", nickname]);

export const requestedUserQuery = (nickname: string) => {
  const currentUser = getUser();
  const navigate = useNavigate()

  return useQuery({
    queryKey: REQUESTED_USER_QUERY_KEY(nickname),
    queryFn: async () => {
      const res = await getRequestedUser(nickname)

      if (res === 'not-exist') {
        return navigate({ to: `${REDIRECT_USER_NOT_EXIST}${currentUser.nickname}&timeout=5` })
      }

      return res
    },
    refetchOnWindowFocus: false,
  });
};