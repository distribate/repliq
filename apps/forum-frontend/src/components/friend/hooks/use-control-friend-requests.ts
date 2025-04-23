import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFriendRequest } from "../queries/delete-friend-request.ts";
import { toast } from "sonner";
import { acceptFriendRequest } from "../queries/accept-friend-request.ts";
import { ControFriendShip, ControlFriendRequests, USER_FRIEND_DELETE_MUTATION_KEY } from "#components/friend/hooks/use-control-friend.ts";
import { createFriendRequest } from "#components/friend/queries/create-friend-request.ts";
import { deleteFriend } from "#components/friend/queries/delete-friend.ts";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { GetFriendsResponse } from "@repo/types/schemas/friend/friend-types.ts";
import { useRouter } from "@tanstack/react-router";
import { REQUESTED_USER_QUERY_KEY } from "@repo/lib/queries/requested-user-query.ts";
import { forumUserClient } from "@repo/shared/api/forum-client.ts";
import { InferResponseType } from "hono/client"
import { REQUESTS_INCOMING_QUERY_KEY } from "#components/friends/queries/requests-incoming-query.ts";
import { FRIENDS_COUNT_QUERY_KEY } from "#components/friends/queries/friends-count-query.ts";
import { REQUESTS_OUTGOING_QUERY_KEY } from "#components/friends/queries/requests-outgoing-query.ts";
import { FRIENDS_QUERY_KEY } from "#components/friends/queries/friends-query.ts";
import { FRIEND_STATUS_QUERY_KEY } from "../components/friend-button/queries/friend-status-query.ts";

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

const reqClient = forumUserClient.user["get-friends-requests"].$get

type FriendsRequests = InferResponseType<typeof reqClient, 200>["data"]

export const useControlFriendRequests = () => {
  const qc = useQueryClient();
  const { nickname: currentUserNickname } = getUser();
  const { invalidate } = useRouter()

  const acceptIncomingRequestMutation = useMutation({
    mutationFn: async ({
      request_id, recipient
    }: ControlFriendRequests) => acceptFriendRequest({ request_id }),
    onSuccess: async (data, variables) => {
      if (!data) return;

      const { status, error } = data;

      if (!status) return;

      if (!error) {
        toast.success(friendRequestStatus[status]);

        const cachedRequestedUser = qc.getQueryData(REQUESTED_USER_QUERY_KEY(variables.recipient))

        if (cachedRequestedUser) {
          await qc.invalidateQueries({
            queryKey: REQUESTED_USER_QUERY_KEY(variables.recipient)
          })
        }

        const cachedFriendStatus = qc.getQueryData(FRIEND_STATUS_QUERY_KEY(variables.recipient))

        if (cachedFriendStatus) {
          await qc.invalidateQueries({
            queryKey: FRIEND_STATUS_QUERY_KEY(variables.recipient)
          })
        }

        await Promise.all([
          qc.invalidateQueries({
            queryKey: REQUESTS_INCOMING_QUERY_KEY
          }),
          qc.invalidateQueries({
            queryKey: FRIENDS_QUERY_KEY(currentUserNickname)
          }),
          qc.invalidateQueries({
            queryKey: FRIENDS_COUNT_QUERY_KEY(currentUserNickname)
          }),
          qc.invalidateQueries({
            queryKey: FRIEND_STATUS_QUERY_KEY(variables.recipient)
          }),
        ])

        return invalidate()
      } else {
        return toast.error("Произошла ошибка", {
          description: friendRequestStatus[error] ?? error,
        });
      }
    },
    onError: e => {
      throw new Error(e.message);
    },
  });

  const rejectIncomingRequestMutation = useMutation({
    mutationFn: async ({
      request_id, recipient
    }: ControlFriendRequests) => deleteFriendRequest({ request_id }),
    onSuccess: async (data, variables) => {
      if (!data) return

      const { status, error } = data;

      if (!status) return;

      if (error) {
        return toast.error("Произошла ошибка", {
          description: friendRequestStatus[error] ?? error,
        });
      }

      toast.success(friendRequestStatus[status]);

      const incomingRequests = qc.getQueryData(REQUESTS_INCOMING_QUERY_KEY)

      if (incomingRequests) {
        qc.setQueryData(REQUESTS_INCOMING_QUERY_KEY, (prev: FriendsRequests) => 
          prev.filter(req => req.id !== variables.request_id));
      }

      console.log(incomingRequests, variables.recipient)

      await qc.invalidateQueries({
        queryKey: FRIEND_STATUS_QUERY_KEY(variables.recipient)
      });
    },
    onError: e => {
      throw new Error(e.message);
    },
  });

  const rejectOutgoingRequestMutation = useMutation({
    mutationFn: async ({
      request_id, recipient
    }: ControlFriendRequests) => deleteFriendRequest({ request_id }),
    onSuccess: async (data, variables) => {
      if (!data) return

      const { status, error } = data;

      if (!status) return;

      if (error) {
        return toast.error("Произошла ошибка", {
          description: friendRequestStatus[error] ?? error,
        });
      }

      toast.success(friendRequestStatus[status]);

      const outgoingRequests = qc.getQueryData(REQUESTS_OUTGOING_QUERY_KEY)

      if (outgoingRequests) {
        qc.setQueryData(REQUESTS_OUTGOING_QUERY_KEY, (prev: FriendsRequests) => 
          prev.filter(req => req.id !== variables.request_id));
      }

      await qc.invalidateQueries({
        queryKey: FRIEND_STATUS_QUERY_KEY(variables.recipient)
      });
    },
    onError: e => {
      throw new Error(e.message);
    },
  });

  const createRequestFriendMutation = useMutation({
    mutationFn: async ({
      recipient
    }: Omit<ControlFriendRequests, "request_id">) => createFriendRequest({ recipient }),
    onSuccess: async (data, variables) => {
      if (!data) return;

      const { status, error } = data;

      if (!status) return;

      if (error) {
        return toast.error("Невозможно добавить этого игрока в друзья", {
          description: friendRequestStatus[error] ?? error,
        });
      }

      const outgoingRequests = qc.getQueryData(REQUESTS_OUTGOING_QUERY_KEY)

      if (outgoingRequests) {
        qc.invalidateQueries({
          queryKey: REQUESTS_OUTGOING_QUERY_KEY
        })
      }

      toast.success(friendRequestStatus[status]);

      return await qc.invalidateQueries({
        queryKey: FRIEND_STATUS_QUERY_KEY(variables.recipient)
      })
    },
    onError: e => {
      throw new Error(e.message);
    },
  });

  const removeFriendMutation = useMutation({
    mutationKey: USER_FRIEND_DELETE_MUTATION_KEY,
    mutationFn: async ({
      friend_id, recipient
    }: ControFriendShip) => deleteFriend({ friend_id }),
    onSuccess: async (data, variables) => {
      if (!data) return;

      const { status, error } = data;

      if (!status) return;

      if (error) {
        return toast.error("Произошла ошибка", {
          description: friendRequestStatus[error] ?? error,
        });
      }

      toast.success(friendRequestStatus[status]);

      await Promise.all([
        qc.invalidateQueries({
          queryKey: FRIEND_STATUS_QUERY_KEY(variables.recipient)
        }),
        qc.invalidateQueries({
          queryKey: FRIENDS_COUNT_QUERY_KEY(currentUserNickname)
        }),
        qc.invalidateQueries({
          queryKey: REQUESTED_USER_QUERY_KEY(variables.recipient)
        }),
        invalidate()
      ])

      return qc.setQueryData(FRIENDS_QUERY_KEY(currentUserNickname),
        (prev: GetFriendsResponse) => ({
          ...prev,
          data: prev.data.filter(friend => friend.friend_id !== variables.friend_id)
        })
      );
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