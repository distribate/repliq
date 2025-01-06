"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FRIENDS_QUERY_KEY } from "#friends/queries/friends-query.ts";
import { setPinFriend } from "#friends/queries/set-pin-friend.ts";
import { setUnpinFriend } from "#friends/queries/set-unpin-friend.ts";
import { setNoteFriend } from "#friends/queries/set-note-friend.ts";
import { setUnNoteFriend } from "#friends/queries/set-unnote-friend.ts";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { resolveFriendId } from "#friend/components/friend-card/helpers/resolve-friend-id.ts";
import { FriendWithDetails } from "@repo/types/schemas/friend/friend-types.ts";
import { toast } from "sonner";
import { ControlFriendProperties } from "../types/friend-request-types";

type SetFriendNote = ControlFriendProperties & {
  note: string;
};

export const USER_FRIEND_DELETE_MUTATION_KEY = ["user-friend-delete-list"];

type GetFriendId = {
  friend_id: string | null,
  recipient: string,
  friends: FriendWithDetails[],
}

const getFriendId = ({
  friend_id, friends, recipient
}: GetFriendId) => {
  if (friend_id) return friend_id;
  const friend = resolveFriendId(friends, recipient);
  return friend ? friend.friend_id : null;
};

export const useControlFriend = () => {
  const qc = useQueryClient();
  const currentUser = getUser();

  const setFriendUnNoteMutation = useMutation({
    mutationFn: async ({ recipient, friend_id }: ControlFriendProperties) => {
      const friends = qc.getQueryData<FriendWithDetails[]>(FRIENDS_QUERY_KEY(currentUser.nickname));
      if (!friends) return;

      const friendId = getFriendId({
        friend_id: friend_id ?? null, recipient, friends
      });

      if (!friendId) return;

      return setUnNoteFriend({
        friend_id: friendId,  recipient,
      });
    },
    onSuccess: (data) => {
      if (!data) return;

      const friends = qc.getQueryData<FriendWithDetails[]>(FRIENDS_QUERY_KEY(currentUser.nickname));
      if (!friends) return;

      const updatedFriends = friends.map(friend =>
        friend.friend_id === data.friend_id
          ? { ...friend, note: null }
          : friend
      );

      toast.success("Заметка удалена");

      return qc.setQueryData(FRIENDS_QUERY_KEY(currentUser.nickname), updatedFriends)
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  const setFriendNoteMutation = useMutation({
    mutationFn: async ({ recipient, friend_id, note }: SetFriendNote) => {
      const friends = qc.getQueryData<FriendWithDetails[]>(FRIENDS_QUERY_KEY(currentUser.nickname));
      if (!friends) return;

      const friendId = getFriendId({
        friend_id: friend_id ?? null, recipient, friends
      });

      if (!friendId || !note) return;

      return setNoteFriend({
        friend_id: friendId,
        note, recipient,
      });
    },
    onSuccess: (data) => {
      if (!data) return;

      const friends = qc.getQueryData<FriendWithDetails[]>(FRIENDS_QUERY_KEY(currentUser.nickname));
      if (!friends) return;

      const updatedFriends = friends.map(friend =>
        friend.friend_id === data.friend_id
          ? { ...friend, note: data.note }
          : friend
      );

      toast.success("Заметка обновлена");

      return qc.setQueryData(FRIENDS_QUERY_KEY(currentUser.nickname), updatedFriends)
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  const setFriendUnpinMutation = useMutation({
    mutationFn: async ({ recipient, friend_id }: ControlFriendProperties) => {
      const friends = qc.getQueryData<FriendWithDetails[]>(FRIENDS_QUERY_KEY(currentUser.nickname));
      if (!friends) return;

      const friendId = getFriendId({
        friend_id: friend_id ?? null, recipient, friends
      });

      if (!friendId) return;

      return setUnpinFriend({
        friend_id: friendId,recipient,
      });
    },
    onSuccess: async (data) => {
      if (!data) return;

      toast.success("Друг успешно откреплен");

      const friends = qc.getQueryData<FriendWithDetails[]>(FRIENDS_QUERY_KEY(currentUser.nickname));
      if (!friends) return;

      const updatedFriends = friends.map(friend =>
        friend.friend_id === data.friend_id
          ? { ...friend, is_pinned: false }
          : friend
      );

      return qc.setQueryData(FRIENDS_QUERY_KEY(currentUser.nickname), updatedFriends)
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  const setFriendPinnedMutation = useMutation({
    mutationFn: async ({ recipient, friend_id }: ControlFriendProperties) => {
      const friends = qc.getQueryData<FriendWithDetails[]>(FRIENDS_QUERY_KEY(currentUser.nickname));
      if (!friends) return;

      const friendId = getFriendId({
        friend_id: friend_id ?? null, recipient, friends
      });

      if (!friendId) return;

      return setPinFriend({
        friend_id: friendId, recipient,
      })
    },
    onSuccess: async (data) => {
      if (!data) return;

      toast.success("Друг успешно закреплен");

      const friends = qc.getQueryData<FriendWithDetails[]>(FRIENDS_QUERY_KEY(currentUser.nickname));
      if (!friends) return;

      const updatedFriends = friends.map(friend =>
        friend.friend_id === data.friend_id
          ? { ...friend, is_pinned: true }
          : friend
      );

      return qc.setQueryData(FRIENDS_QUERY_KEY(currentUser.nickname), updatedFriends)
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