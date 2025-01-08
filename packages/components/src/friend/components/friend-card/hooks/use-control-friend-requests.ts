"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFriendRequest } from "../queries/delete-friend-request.ts";
import { toast } from "sonner";
import { acceptFriendRequest } from "../queries/accept-friend-request.ts";
import { useRouter } from "next/navigation";
import { USER_FRIEND_DELETE_MUTATION_KEY } from "#friend/components/friend-card/hooks/use-control-friend.ts";
import { createFriendRequest } from "#friend/components/friend-card/queries/create-friend-request.ts";
import { deleteFriend } from "#friend/components/friend-card/queries/delete-friend.ts";
import { FRIEND_STATUS_QUERY_KEY } from "#buttons/friend-status-query.ts";
import { ControFriendShip, ControlFriendRequests } from "../types/friend-request-types.ts";
import { REQUESTS_OUTGOING_QUERY_KEY } from "#friends/queries/requests-outgoing-query.ts";
import { REQUESTS_INCOMING_QUERY_KEY } from "#friends/queries/requests-incoming-query.ts";
import { FRIENDS_QUERY_KEY } from "#friends/queries/friends-query.ts";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { GetFriendsResponse } from "@repo/types/schemas/friend/friend-types.ts";
import { FRIENDS_COUNT_QUERY_KEY } from "#friends/queries/friends-count-query.ts";

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
  const { refresh } = useRouter();
  const { nickname: currentUserNickname } = getUser();

  const acceptIncomingRequestMutation = useMutation({
    mutationFn: async ({ request_id, recipient }: ControlFriendRequests) => acceptFriendRequest({ request_id }),
    onSuccess: async (data, variables) => {
      if (!data) return;

      const { status: createRequestStatus, error: createRequestError } = data;

      if (!createRequestStatus) return;

      if (!createRequestError) {
        toast.success(friendRequestStatus[createRequestStatus]);

        qc.invalidateQueries({
          queryKey: FRIENDS_QUERY_KEY(currentUserNickname)
        });

        return qc.invalidateQueries({
          queryKey: FRIEND_STATUS_QUERY_KEY(variables.recipient)
        });
      } else {
        return toast.error("Произошла ошибка", {
          description: friendRequestStatus[createRequestError] ?? createRequestError,
        });
      }
    },
    onError: e => {
      throw new Error(e.message);
    },
  });

  const rejectIncomingRequestMutation = useMutation({
    mutationFn: async ({ request_id, recipient }: ControlFriendRequests) => deleteFriendRequest({ request_id }),
    onSuccess: async (data, variables) => {
      if (!data) return

      const { status: createRequestStatus, error: createRequestError } = data;

      if (!createRequestStatus) return;

      if (!createRequestError) {
        toast.success(friendRequestStatus[createRequestStatus]);

        const incomingRequests = qc.getQueryData(REQUESTS_INCOMING_QUERY_KEY)

        if (incomingRequests) {
          qc.invalidateQueries({
            queryKey: REQUESTS_INCOMING_QUERY_KEY
          });
        }

        return qc.invalidateQueries({
          queryKey: FRIEND_STATUS_QUERY_KEY(variables.recipient)
        });
      } else {
        return toast.error("Произошла ошибка", {
          description: friendRequestStatus[createRequestError] ?? createRequestError,
        });
      }
    },
    onError: e => {
      throw new Error(e.message);
    },
  });

  const rejectOutgoingRequestMutation = useMutation({
    mutationFn: async ({ request_id }: ControlFriendRequests) => deleteFriendRequest({ request_id }),
    onSuccess: async (data, variables) => {
      if (!data) return

      const { status: createRequestStatus, error: createRequestError } = data;

      if (!createRequestStatus) return;

      if (!createRequestError) {
        toast.success(friendRequestStatus[createRequestStatus]);

        const outgoingRequests = qc.getQueryData(REQUESTS_OUTGOING_QUERY_KEY)

        if (outgoingRequests) {
          qc.invalidateQueries({
            queryKey: REQUESTS_OUTGOING_QUERY_KEY
          });
        }

        return qc.invalidateQueries({
          queryKey: FRIEND_STATUS_QUERY_KEY(variables.recipient)
        });
      } else {
        return toast.error("Произошла ошибка", {
          description: friendRequestStatus[createRequestError] ?? createRequestError,
        });
      }
    },
    onError: e => {
      throw new Error(e.message);
    },
  });

  const createRequestFriendMutation = useMutation({
    mutationFn: async ({ recipient }: Omit<ControlFriendRequests, "request_id">) => createFriendRequest({ recipient }),
    onSuccess: async (data, variables) => {
      if (!data) return;

      const { status: createRequestStatus, error: createRequestError } = data;

      if (!createRequestStatus) return;

      if (!createRequestError) {
        toast.success(friendRequestStatus[createRequestStatus]);
        return qc.invalidateQueries({
          queryKey: FRIEND_STATUS_QUERY_KEY(variables.recipient)
        });
      } else {
        return toast.error("Невозможно добавить этого игрока в друзья", {
          description: friendRequestStatus[createRequestError] ?? createRequestError,
        });
      }
    },
    onError: e => {
      throw new Error(e.message);
    },
  });

  const removeFriendMutation = useMutation({
    mutationKey: USER_FRIEND_DELETE_MUTATION_KEY,
    mutationFn: async ({ friend_id, recipient }: ControFriendShip) => deleteFriend({ friend_id }),
    onSuccess: async (data, variables) => {
      if (!data) return;

      const { status: createRequestStatus, error: createRequestError } = data;

      if (!createRequestStatus) return;

      if (!createRequestError) {
        toast.success(friendRequestStatus[createRequestStatus]);
        refresh();

        qc.invalidateQueries({
          queryKey: FRIENDS_COUNT_QUERY_KEY(currentUserNickname)
        });

        return qc.setQueryData(FRIENDS_QUERY_KEY(currentUserNickname),
          (prev: GetFriendsResponse) => (
            { ...prev, data: prev.data.filter(friend => friend.friend_id !== variables.friend_id) }
          )
        );
      } else {
        return toast.error("Произошла ошибка", {
          description: friendRequestStatus[createRequestError] ?? createRequestError,
        });
      }
    },
    onError: e => {
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