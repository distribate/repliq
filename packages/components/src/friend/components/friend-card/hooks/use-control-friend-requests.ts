"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFriendRequest } from "../queries/delete-friend-request.ts";
import { toast } from "sonner";
import { acceptFriendRequest } from "../queries/accept-friend-request.ts";
import { SEARCHING_FRIENDS_QUERY_KEY } from "#friends/queries/searching-friends-query.ts";
import {
  REQUESTS_INCOMING_QUERY_KEY,
  requestsIncomingQuery,
} from "#friends/queries/requests-incoming-query.ts";
import {
  REQUESTS_OUTGOING_QUERY_KEY,
  requestsOutgoingQuery,
} from "#friends/queries/requests-outgoing-query.ts";
import { REQUESTS_QUERY_KEY } from "#friends/queries/requests-query.ts";
import { FRIENDS_QUERY_KEY } from "#friends/queries/friends-query.ts";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { useRouter } from "next/navigation";
import { USER_FRIEND_DELETE_MUTATION_KEY } from "#friend/components/friend-card/hooks/use-control-friend.ts";
import { ControlFriendProperties } from "#friend/components/friend-card/types/friend-request-types.ts";
import { createFriendRequest } from "#friend/components/friend-card/queries/create-friend-request.ts";
import { resolveFriendId } from "#friend/components/friend-card/helpers/resolve-friend-id.ts";
import { deleteFriend } from "#friend/components/friend-card/queries/delete-friend.ts";
import { FriendWithDetails } from "@repo/types/schemas/friend/friend-types.ts";

const friendRequestStatus: Record<string, string> = {
  "User does not have accept to send friend request": "Пользователь отключил заявки в друзья",
  "You cannot add yourself": "Вы не можете добавить самого себя в друзья",
  "You are blocked by user": "Этот пользователь вас заблокировал",
  "User blocked by you": "Вы заблокировали этого пользователя",
  "You are already friends": "Вы уже друзья",
  "Friend request sent": "Запрос отправлен",
  "Friend request deleted": "Запрос удален",
  "Friend request accepted": "Запрос принят",
  "Friend deleted": "Пользователь удален из друзей"
} as const;

export const useControlFriendRequests = () => {
  const qc = useQueryClient();
  const currentUser = getUser();
  const { refresh } = useRouter();

  const { data: outgoingRequests } = requestsOutgoingQuery();
  const { data: incomingRequests } = requestsIncomingQuery();

  const invalidateAllFriendsRequests = async () => {
    if (!currentUser) return;

    await Promise.all([
      qc.invalidateQueries({
        queryKey: REQUESTS_INCOMING_QUERY_KEY(currentUser.nickname),
      }),
      qc.invalidateQueries({
        queryKey: REQUESTS_QUERY_KEY(currentUser.nickname),
      }),
      qc.invalidateQueries({
        queryKey: FRIENDS_QUERY_KEY(currentUser.nickname),
      }),
      qc.invalidateQueries({
        queryKey: SEARCHING_FRIENDS_QUERY_KEY(currentUser.nickname),
      }),
      qc.invalidateQueries({
        queryKey: REQUESTS_OUTGOING_QUERY_KEY(currentUser.nickname),
      }),
    ]);
  };

  const acceptIncomingRequestMutation = useMutation({
    mutationFn: async (initiator: string) => {
      if (!currentUser || !incomingRequests) return;

      const incomingRequest = incomingRequests.find(
        (fd) =>
          fd.recipient === currentUser.nickname && fd.initiator === initiator,
      );

      if (!incomingRequest) return;

      return acceptFriendRequest({ initiator, friend_id: incomingRequest.id });
    },
    onSuccess: async (data) => {
      if (!data) return;

      const { status: createRequestStatus, error: createRequestError } = data;

      if (!createRequestError && createRequestStatus) {
        toast.success(friendRequestStatus[createRequestStatus]);
        return invalidateAllFriendsRequests();
      }

      if (createRequestError) {
        return toast.error("Произошла ошибка", {
          description: friendRequestStatus[createRequestError] ?? createRequestError,
        });
      }
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  const rejectIncomingRequestMutation = useMutation({
    mutationFn: async (initiator: string) => {
      if (!currentUser || !incomingRequests) return;

      const incomingRequest = incomingRequests.find(
        (fd) =>
          fd.recipient === currentUser.nickname && fd.initiator === initiator,
      );

      if (!incomingRequest) return;

      return deleteFriendRequest(incomingRequest.id);
    },
    onSuccess: async (data) => {
      if (!data) return

      const { status: createRequestStatus, error: createRequestError } = data;

      if (!createRequestError && createRequestStatus) {
        toast.success(friendRequestStatus[createRequestStatus]);
        return invalidateAllFriendsRequests();
      }

      if (createRequestError) {
        return toast.error("Произошла ошибка", {
          description: friendRequestStatus[createRequestError] ?? createRequestError,
        });
      }
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  const rejectOutgoingRequestMutation = useMutation({
    mutationFn: async (initiator: string) => {
      if (!currentUser || !outgoingRequests) return;

      const outgoingRequest = outgoingRequests.find(
        (fd) =>
          fd.initiator === currentUser.nickname && fd.recipient === initiator,
      );

      if (!outgoingRequest) return;

      return deleteFriendRequest(outgoingRequest.id);
    },
    onSuccess: async (data) => {
      if (!data) return

      const { status: createRequestStatus, error: createRequestError } = data;

      if (!createRequestError && createRequestStatus) {
        toast.success(friendRequestStatus[createRequestStatus]);
        return invalidateAllFriendsRequests();
      }

      if (createRequestError) {
        return toast.error("Произошла ошибка", {
          description: friendRequestStatus[createRequestError] ?? createRequestError,
        });
      }
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  const createRequestFriendMutation = useMutation({
    mutationFn: async (requestedUserNickname: string) => createFriendRequest(requestedUserNickname),
    onSuccess: async (data) => {
      if (!data) return;

      const { status: createRequestStatus, error: createRequestError } = data;

      if (!createRequestError && createRequestStatus) {
        toast.success(friendRequestStatus[createRequestStatus]);
        return invalidateAllFriendsRequests();
      }

      if (createRequestError) {
        return toast.error("Невозможно добавить этого игрока в друзья", {
          description: friendRequestStatus[createRequestError] ?? createRequestError,
        });
      }
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  const removeFriendMutation = useMutation({
    mutationKey: USER_FRIEND_DELETE_MUTATION_KEY,
    mutationFn: async ({ requestedUserNickname, friend_id }: ControlFriendProperties) => {
      if (!currentUser) return;

      let friendId: string | null;

      if (friend_id) { 
        friendId = friend_id
      } else {
        const friends = qc.getQueryData<FriendWithDetails[]>(FRIENDS_QUERY_KEY(currentUser.nickname));
        if (!friends) return;

        const friend = resolveFriendId(friends, requestedUserNickname);
        if (!friend) return;

        friendId = friend.friend_id;
      }

      if (!friendId) return;

      return deleteFriend(friendId);
    },
    onSuccess: async (data) => {
      if (!data) return;

      const { status: createRequestStatus, error: createRequestError } = data;

      refresh();

      if (!createRequestError && createRequestStatus) {
        toast.success(friendRequestStatus[createRequestStatus]);
        return invalidateAllFriendsRequests();
      }

      if (createRequestError) {
        return toast.error("Произошла ошибка", {
          description: friendRequestStatus[createRequestError] ?? createRequestError,
        });
      }
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  return {
    rejectOutgoingRequestMutation,
    rejectIncomingRequestMutation,
    acceptIncomingRequestMutation,
    createRequestFriendMutation,
    removeFriendMutation,
  };
};
