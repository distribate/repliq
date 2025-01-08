"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FRIENDS_QUERY_KEY } from "#friends/queries/friends-query.ts";
import { setPinFriend } from "#friends/queries/set-pin-friend.ts";
import { setUnpinFriend } from "#friends/queries/set-unpin-friend.ts";
import { setNoteFriend } from "#friends/queries/set-note-friend.ts";
import { setUnNoteFriend } from "#friends/queries/set-unnote-friend.ts";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { GetFriendsResponse } from "@repo/types/schemas/friend/friend-types.ts";
import { toast } from "sonner";
import { ControlFriendProperties } from "../types/friend-request-types";

type SetFriendNote = ControlFriendProperties & {
  note: string;
};

export const USER_FRIEND_DELETE_MUTATION_KEY = ["user-friend-delete-list"];

export const useControlFriend = () => {
  const qc = useQueryClient();
  const { nickname } = getUser();

  const setFriendUnNoteMutation = useMutation({
    mutationFn: async ({ recipient, friend_id }: ControlFriendProperties) => setUnNoteFriend({ friend_id, recipient }),
    onSuccess: (data) => {
      if (!data) return;

      toast.success("Заметка удалена");

      return qc.setQueryData(FRIENDS_QUERY_KEY(nickname), (prev: GetFriendsResponse) => {
        const updatedFriends = prev.data.map(friend =>
          friend.friend_id === data.friend_id
            ? { ...friend, note: null }
            : friend
        );

        return {
          ...prev,
          data: updatedFriends
        }
      })
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  const setFriendNoteMutation = useMutation({
    mutationFn: async ({ recipient, friend_id, note }: SetFriendNote) => setNoteFriend({ friend_id, note, recipient }),
    onSuccess: (data) => {
      if (!data) return;

      toast.success("Заметка обновлена");

      return qc.setQueryData(FRIENDS_QUERY_KEY(nickname), (prev: GetFriendsResponse) => {
        const updatedFriends = prev.data.map(friend =>
          friend.friend_id === data.friend_id
            ? { ...friend, note: data.note }
            : friend
        );

        return {
          ...prev,
          data: updatedFriends
        }
      })
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  const setFriendUnpinMutation = useMutation({
    mutationFn: async ({ recipient, friend_id }: ControlFriendProperties) => setUnpinFriend({ friend_id, recipient }),
    onSuccess: async (data) => {
      if (!data) return;

      toast.success("Друг успешно откреплен");

      return qc.setQueryData(FRIENDS_QUERY_KEY(nickname), (prev: GetFriendsResponse) => {
        const updatedFriends = prev.data.map(friend =>
          friend.friend_id === data.friend_id
            ? { ...friend, is_pinned: false }
            : friend
        );

        console.log(updatedFriends)

        return {
          ...prev,
          data: updatedFriends
        }
      })
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  const setFriendPinnedMutation = useMutation({
    mutationFn: async ({ recipient, friend_id }: ControlFriendProperties) => setPinFriend({ friend_id, recipient }),
    onSuccess: async (data) => {
      if (!data) return;

      toast.success("Друг успешно закреплен");

      return qc.setQueryData(FRIENDS_QUERY_KEY(nickname), (prev: GetFriendsResponse) => {
        const updatedFriends = prev.data.map(friend =>
          friend.friend_id === data.friend_id
            ? { ...friend, is_pinned: true }
            : friend
        );

        return {
          ...prev,
          data: updatedFriends
        }
      })
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  return {
    setFriendPinnedMutation,
    setFriendUnpinMutation,
    setFriendUnNoteMutation,
    setFriendNoteMutation,
  };
};