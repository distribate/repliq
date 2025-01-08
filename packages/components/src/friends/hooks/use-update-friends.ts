import { FRIENDS_QUERY_KEY } from "#friends/queries/friends-query.ts";
import { GetFriends, getFriends } from "#friends/queries/get-friends.ts";
import { FRIENDS_SORT_QUERY_KEY, FriendsSortQuery, friendsSortQuery } from "#profile/components/friends/queries/friends-settings-query.ts";
import { getUser } from "@repo/lib/helpers/get-user";
import { GetFriendsResponse } from "@repo/types/schemas/friend/friend-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const UPDATE_FRIENDS_MUTATION_KEY = ["update-friends-mutation"];

export const useUpdateFriends = () => {
  const qc = useQueryClient();
  const { sort_type, ascending } = friendsSortQuery().data;
  const { nickname } = getUser()

  const updateFriendsMutation = useMutation({
    mutationKey: UPDATE_FRIENDS_MUTATION_KEY,
    mutationFn: async ({ with_details, cursor }: Pick<GetFriends, "cursor" | "with_details">) => getFriends({
      cursor, with_details, ascending, sort_type, nickname
    }),
    onSuccess: async (data, variables) => {
      if (data) {
        qc.setQueryData(FRIENDS_QUERY_KEY(nickname), (oldData: GetFriendsResponse) => {
          if (!oldData) return { data: data, meta: data.meta };

          qc.setQueryData(FRIENDS_SORT_QUERY_KEY, (prev: FriendsSortQuery) => ({
            ...prev,
            type: "other"
          }))

          const newFriends = data.data.filter(
            friend => !oldData.data.some(existing => existing.friend_id === friend.friend_id)
          );

          return {
            data: [...oldData.data, ...newFriends],
            meta: data.meta,
          };
        });
      } else {
        const currentFriends = qc.getQueryData<GetFriendsResponse>(
          FRIENDS_QUERY_KEY(nickname)
        );

        return { data: currentFriends?.data, meta: currentFriends?.meta };
      }
    }
  })

  return { updateFriendsMutation }
}