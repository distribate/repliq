import { useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";
import { useNavigate } from "@tanstack/react-router";
import { forumUserClient } from "@repo/shared/api/forum-client";
import { getUser } from "@repo/lib/helpers/get-user";

export const REQUESTED_USER_QUERY_KEY = (nickname: string) =>
  createQueryKey("user", ["requested", nickname]);

async function getUserProfile(nickname: string) {
  const res = await forumUserClient.user["get-user-profile"][":nickname"].$get({
    param: { nickname }
  })

  const data = await res.json()

  if ("error" in data) {
    return null;
  }

  if (!data) {
    return "not-exist"
  }

  return data.data
}

export const requestedUserQuery = (nickname: string) => {
  const currentUser = getUser();
  const navigate = useNavigate()

  return useQuery({
    queryKey: REQUESTED_USER_QUERY_KEY(nickname),
    queryFn: async () => {
      if (currentUser.nickname === nickname) {
        return {
          ...currentUser,
          details: {
            status: null,
            is_viewed: true
          }
        }
      }

      const res = await getUserProfile(nickname)

      if (!res) {
        throw navigate({
          to: "."
        })
      }

      if (res === 'not-exist') {
        throw navigate({
          to: "/not-exist", search: {
            redirect_nickname: currentUser.nickname,
            timeout: "5",
          },
        })
      }

      return res
    },
    refetchInterval: 1000 * 60 * 5,
    refetchOnWindowFocus: false
  });
};