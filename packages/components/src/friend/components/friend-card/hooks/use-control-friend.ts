"use client";

import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { SEARCHING_FRIENDS_QUERY_KEY } from "#friends/queries/searching-friends-query.ts";
import { REQUESTS_OUTGOING_QUERY_KEY } from "#friends/queries/requests-outgoing-query.ts";
import { REQUESTS_QUERY_KEY } from "#friends/queries/requests-query.ts";
import { FRIENDS_QUERY_KEY } from "#friends/queries/friends-query.ts";
import { REQUESTS_INCOMING_QUERY_KEY } from "#friends/queries/requests-incoming-query.ts";
import { setPinFriend } from "#friends/queries/set-pin-friend.ts";
import { setUnpinFriend } from "#friends/queries/set-unpin-friend.ts";
import { setNoteFriend } from "#friends/queries/set-note-friend.ts";
import { setUnNoteFriend } from "#friends/queries/set-unnote-friend.ts";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { ControlFriendProperties } from "#friend/components/friend-card/types/friend-request-types.ts";
import { resolveFriendId } from "#friend/components/friend-card/helpers/resolve-friend-id.ts";
import { UserFriends } from "#friends/queries/get-friends.ts";

type SetFriendNote = ControlFriendProperties & {
  note: string;
};

export const USER_FRIEND_DELETE_MUTATION_KEY = ["user-friend-delete-list"];

export const useControlFriend = () => {
  const qc = useQueryClient();
  const currentUser = getUser();

  const invalidateAllFriendsRequests = async () => {
    await Promise.all([
      qc.invalidateQueries({
        queryKey: REQUESTS_QUERY_KEY(currentUser.nickname),
      }),
      qc.invalidateQueries({
        queryKey: SEARCHING_FRIENDS_QUERY_KEY(currentUser.nickname),
      }),
      qc.invalidateQueries({
        queryKey: FRIENDS_QUERY_KEY(currentUser.nickname),
      }),
      qc.invalidateQueries({
        queryKey: REQUESTS_INCOMING_QUERY_KEY(currentUser.nickname),
      }),
      qc.invalidateQueries({
        queryKey: REQUESTS_OUTGOING_QUERY_KEY(currentUser.nickname),
      }),
    ]);
  };

  const handleFriendAction = async (
    action: Function,
    errorMessage: string,
    invalidateKey?: QueryKey,
  ) => {
    const { status } = await action();

    if (status === 200 || status === 204 || status === 201) {
      if (invalidateKey) {
        return qc.invalidateQueries({ queryKey: invalidateKey });
      }
    } else {
      throw new Error(errorMessage);
    }
  };

  const setFriendUnNoteMutation = useMutation({
    mutationFn: async ({
      reqUserNickname,
      friend_id,
    }: ControlFriendProperties) => {
      let friendId: string | null;

      if (friend_id) {
        friendId = friend_id;
      } else {
        const friends = qc.getQueryData<UserFriends[]>(
          FRIENDS_QUERY_KEY(currentUser.nickname),
        );
        if (!friends) return null;

        const friend = resolveFriendId(friends, reqUserNickname);
        if (!friend) return null;

        friendId = friend.friend_id;
      }

      if (!friendId) return;

      return handleFriendAction(
        () =>
          setUnNoteFriend({
            friend_id: friendId,
            recipient: reqUserNickname,
          }),
        "Произошла ошибка. Попробуйте позже",
        FRIENDS_QUERY_KEY(currentUser?.nickname),
      );
    },
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: FRIENDS_QUERY_KEY(currentUser?.nickname),
      }),
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  const setFriendNoteMutation = useMutation({
    mutationFn: async ({ reqUserNickname, friend_id, note }: SetFriendNote) => {
      let friendId: string | null;

      if (friend_id) {
        friendId = friend_id;
      } else {
        const friends = qc.getQueryData<UserFriends[]>(
          FRIENDS_QUERY_KEY(currentUser.nickname),
        );
        if (!friends) return null;

        const friend = resolveFriendId(friends, reqUserNickname);
        if (!friend) return null;

        friendId = friend.friend_id;
      }

      if (!friendId || !note || !currentUser) return;

      const friends = qc.getQueryData<UserFriends[]>(
        FRIENDS_QUERY_KEY(currentUser.nickname),
      );

      const isNoted =
        friends?.some((fd) => fd.friend_id === friendId && !!fd.note) || false;

      return handleFriendAction(
        () =>
          setNoteFriend({
            friend_id: friendId,
            note,
            isNoted,
            recipient: reqUserNickname,
          }),
        "Произошла ошибка. Попробуйте позже",
        FRIENDS_QUERY_KEY(currentUser?.nickname),
      );
    },
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: FRIENDS_QUERY_KEY(currentUser?.nickname),
      }),
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  const setFriendUnpinMutation = useMutation({
    mutationFn: async ({
      reqUserNickname,
      friend_id,
    }: ControlFriendProperties) => {
      let friendId: string | null;

      if (friend_id) {
        friendId = friend_id;
      } else {
        const friends = qc.getQueryData<UserFriends[]>(
          FRIENDS_QUERY_KEY(currentUser.nickname),
        );
        if (!friends) return null;

        const friend = resolveFriendId(friends, reqUserNickname);
        if (!friend) return null;

        friendId = friend.friend_id;
      }

      if (!friendId) return;

      return handleFriendAction(
        () =>
          setUnpinFriend({
            friend_id: friendId,
            recipient: reqUserNickname,
          }),
        "Произошла ошибка. Попробуйте позже",
        FRIENDS_QUERY_KEY(currentUser?.nickname),
      );
    },
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: FRIENDS_QUERY_KEY(currentUser?.nickname),
      }),
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  const setFriendPinnedMutation = useMutation({
    mutationFn: async ({
      reqUserNickname,
      friend_id,
    }: ControlFriendProperties) => {
      let friendId: string | null;

      if (friend_id) {
        friendId = friend_id;
      } else {
        const friends = qc.getQueryData<UserFriends[]>(
          FRIENDS_QUERY_KEY(currentUser.nickname),
        );
        if (!friends) return null;

        const friend = resolveFriendId(friends, reqUserNickname);
        if (!friend) return null;

        friendId = friend.friend_id;
      }

      if (!friendId) return;

      return handleFriendAction(
        () =>
          setPinFriend({
            friend_id: friendId,
            recipient: reqUserNickname,
          }),
        "Произошла ошибка. Попробуйте позже",
        FRIENDS_QUERY_KEY(currentUser?.nickname),
      );
    },
    onSuccess: invalidateAllFriendsRequests,
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
