import { FRIENDS_QUERY_KEY } from "#friends/queries/friends-query.ts";
import { getFriends } from "#friends/queries/get-friends.ts";
import { FRIENDS_SORT_QUERY_KEY, FriendsSortQuery } from "#profile/components/friends/queries/friends-settings-query.ts";
import { GetFriendsResponse } from "@repo/types/schemas/friend/friend-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const UPDATE_FRIENDS_MUTATION_KEY = ["update-friends-mutation"];

type UseUpdateFriends = {
  nickname: string;
  type: "update-filter" | "update-cursor"
  with_details?: boolean
}

export const useUpdateFriends = () => {
  const qc = useQueryClient();

  const updateFriendsMutation = useMutation({
    mutationKey: UPDATE_FRIENDS_MUTATION_KEY,
    mutationFn: async ({ with_details, nickname }: UseUpdateFriends) => {
      const filtering = qc.getQueryData<FriendsSortQuery>(FRIENDS_SORT_QUERY_KEY)

      if (!filtering) return;

      return getFriends({ with_details: with_details ?? true, nickname, ...filtering })
    },
    onSuccess: async (data, variables) => {
      if (!data) {
        const currentFriends = qc.getQueryData<GetFriendsResponse>(FRIENDS_QUERY_KEY(variables.nickname));

        return { data: currentFriends?.data, meta: currentFriends?.meta };
      }

      if (variables.type === "update-filter") {
        qc.setQueryData(FRIENDS_QUERY_KEY(variables.nickname), data)

        return qc.setQueryData(FRIENDS_SORT_QUERY_KEY, (prev: FriendsSortQuery) => ({
          ...prev,
          cursor: undefined,
        }));
      }

      qc.setQueryData(FRIENDS_QUERY_KEY(variables.nickname), (prev: GetFriendsResponse) => {
        if (!prev) {
          return { data: data.data, meta: data.meta };
        }

        const newFriends = data.data.filter(
          friend => !prev.data.some(exist => exist.friend_id === friend.friend_id)
        );

        return { data: [...prev.data, ...newFriends], meta: data.meta };
      });
    }
  })

  return { updateFriendsMutation }
}