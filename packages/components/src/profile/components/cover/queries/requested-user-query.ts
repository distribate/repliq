import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getRequestedUser,
} from "@repo/lib/queries/get-requested-user.ts";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { UserEntity } from "@repo/types/entities/entities-type.ts";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";

export const REQUESTED_USER_QUERY_KEY = (nickname: string) =>
  createQueryKey("user", ["requested", nickname]);

export const requestedUserQuery = ({
  nickname,
}: Pick<UserEntity, "nickname">) => {
  const qc = useQueryClient();
  const currentUser = getUser();
  const isOwnProfile = currentUser.nickname === nickname;

  if (isOwnProfile) {
    qc.setQueryData(REQUESTED_USER_QUERY_KEY(nickname), currentUser);
    return { data: currentUser, isLoading: false };
  }

  return useQuery({
    queryKey: REQUESTED_USER_QUERY_KEY(nickname),
    queryFn: () => getRequestedUser(currentUser.nickname, nickname),
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });
};
