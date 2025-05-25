import { toast } from "sonner";
import { ControFriendShip, ControlFriendRequests } from "#components/friend/models/control-friend.model";
import { friendsCountAction } from "#components/friends/models/friends-count.model.ts";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { router } from "#main.tsx";
import { atom, Ctx } from "@reatom/core";
import { incomingRequestsAction, incomingRequestsAtom, outgoingRequestsAction, outgoingRequestsAtom } from "#components/friends/models/friends-requests.model.ts";
import { forumUserClient } from '@repo/shared/api/forum-client.ts';
import { friendStatusesAtom } from "../components/friend-button/models/friend-status.model";
import { myFriendsAction, myFriendsDataAtom } from "#components/friends/models/friends.model";
import { withReset } from "@reatom/framework";

type ControlIncomingRequest = ControlFriendRequests & { type: "reject" | "accept" }
type ControlOutgoingRequest = ControlFriendRequests & { type: "reject" | "create" }

type ControlFriendRequest = {
  request_id: string;
  recipient: string
  friend_id: string
}

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

const controlIncomingRequestVariablesAtom = atom<ControlIncomingRequest | null>(null, "acceptIncomingRequestVariables")
const controlOutgoingRequestVariablesAtom = atom<ControlOutgoingRequest | null>(null, "controlOutgoingRequestVariables")
const removeFriendActionVariablesAtom = atom<ControFriendShip | null>(null, "removeFriendActionVariables")

export async function deleteFriend({ friend_id }: Pick<ControlFriendRequest, "friend_id">) {
  const res = await forumUserClient.user["delete-friend"].$delete({ json: { friend_id } })
  const data = await res.json();

  if ("error" in data) {
    return { error: data.error }
  }

  return { status: data.status, error: null }
}

export async function deleteFriendRequest({ request_id }: Pick<ControlFriendRequest, "request_id">) {
  const res = await forumUserClient.user["delete-friend-request"].$post({ json: { request_id } })
  const data = await res.json();

  if ("error" in data) {
    return { error: data.error }
  }

  return {
    data: {
      request_id: null,
      status: data.status
    },
    error: null
  }
}

export async function createFriendRequest({ recipient }: Pick<ControlFriendRequest, "recipient">) {
  const res = await forumUserClient.user["create-friend-request"].$post({ json: { recipient } })
  const data = await res.json();

  if ("error" in data) {
    return { error: data.error }
  }

  return {
    data: {
      request_id: data.request_id,
      status: data.status
    },
    error: null
  }
}

export async function acceptFriendRequest({ request_id }: Pick<ControlFriendRequest, "request_id">) {
  const res = await forumUserClient.user["accept-friend-request"].$post({ json: { request_id } })
  const data = await res.json();

  if ("error" in data) {
    return { error: data.error }
  }

  return {
    data: {
      status: data.status,
      friend_id: data.friend_id
    },
    error: null
  }
}

const updateFriendsCount = (ctx: Ctx, type: "remove" | "add") => {
  if (ctx.get(friendsCountAction.dataAtom)) {
    const amount = type === 'add' ? 1 : -1;
    friendsCountAction.dataAtom(ctx, (count) => (count ?? 0) + amount);
  }
}

export const controlOutgoingRequestAction = reatomAsync(async (ctx, options: ControlOutgoingRequest) => {
  controlOutgoingRequestVariablesAtom(ctx, options)

  switch (options.type) {
    case "create":
      return await ctx.schedule(() => createFriendRequest({ recipient: options.recipient }));
    case "reject":
      return await ctx.schedule(() => deleteFriendRequest({ request_id: options.request_id }))
  }
}, {
  name: "controlOutgoingRequestAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    const variables = ctx.get(controlOutgoingRequestVariablesAtom)
    if (!variables) return;

    const { data, error } = res;
    if (!data) return;

    const currentPath = router.state.location.pathname;

    toast.success(friendRequestStatus[data.status]);

    if (variables.type === 'reject') {
      if (error) {
        return toast.error("Произошла ошибка", {
          description: friendRequestStatus[error] ?? error
        });
      }

      if (currentPath === '/friends') {
        outgoingRequestsAtom(ctx, null)
        outgoingRequestsAction(ctx)
      } else {
        friendStatusesAtom(ctx, (state) => ({
          ...state,
          [variables.recipient]: { request_id: null, status: "not-friend", friend_id: null }
        }))

        ctx.schedule(() => router.invalidate())
      }
    }

    if (variables.type === 'create') {
      if (error) {
        return toast.error("Невозможно добавить этого игрока в друзья", {
          description: friendRequestStatus[error] ?? error
        });
      }

      if (currentPath === '/friends') {
        outgoingRequestsAtom(ctx, null)
        outgoingRequestsAction(ctx)
        updateFriendsCount(ctx, "add")
        myFriendsAction(ctx)
      } else {
        friendStatusesAtom(ctx, (state) => ({
          ...state,
          [variables.recipient]: { request_id: data.request_id, status: "reject-request", friend_id: null }
        }))

        ctx.schedule(() => router.invalidate())
      }
    }
  }
}).pipe(withStatusesAtom())

export const controlIncomingRequestAction = reatomAsync(async (ctx, options: ControlIncomingRequest) => {
  controlIncomingRequestVariablesAtom(ctx, options)

  switch (options.type) {
    case "accept":
      return await ctx.schedule(() => acceptFriendRequest({ request_id: options.request_id }))
    case "reject":
      return await ctx.schedule(() => deleteFriendRequest({ request_id: options.request_id }))
  }
}, {
  name: "controlIncomingRequestAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    const { data, error } = res;
    const variables = ctx.get(controlIncomingRequestVariablesAtom)
    if (!variables || !data) return;

    if (error) {
      return toast.error("Произошла ошибка", {
        description: friendRequestStatus[error] ?? error
      });
    }

    toast.success(friendRequestStatus[data.status]);

    const currentPath = router.state.location.pathname;

    if (variables.type === 'accept') {
      if (currentPath === '/friends') {
        incomingRequestsAtom(ctx, null)
        incomingRequestsAction(ctx)
        updateFriendsCount(ctx, "add")
        myFriendsAction(ctx)
      } else {
        if ("friend_id" in data) {
          friendStatusesAtom(ctx, (state) => ({
            ...state,
            [variables.recipient]: { friend_id: data.friend_id!, status: "friend", request_id: null }
          }))
        }

        ctx.schedule(() => router.invalidate())
      }
    }

    if (variables.type === 'reject') {
      if (currentPath === '/friends') {
        incomingRequestsAtom(ctx, null)
        incomingRequestsAction(ctx)
      } else {
        friendStatusesAtom(ctx, (state) => ({
          ...state,
          [variables.recipient]: { friend_id: null, status: "not-friend", request_id: null }
        }))

        ctx.schedule(() => router.invalidate())
      }
    }
  }
}).pipe(withStatusesAtom())


export const removeFriendIsOpenAtom = atom(false, "removeFriendIsOpen")
export const removeFriendOptionsAtom = atom<{ nickname: string, friend_id: string } | null>(null, "removeFriendOptions").pipe(withReset())

removeFriendOptionsAtom.onChange((ctx, state) => {
  if (!state) {
    removeFriendOptionsAtom.reset(ctx)
  }
})

export const removeFriendAction = reatomAsync(async (ctx, options: ControFriendShip) => {
  removeFriendActionVariablesAtom(ctx, options)
  return await ctx.schedule(() => deleteFriend({ friend_id: options.friend_id }))
}, {
  name: "removeFriendAction",
  onFulfill: (ctx, res) => {
    if (!res) return

    const { status, error } = res;
    const variables = ctx.get(removeFriendActionVariablesAtom)

    if (!status || !variables) return;

    if (error) {
      return toast.error("Произошла ошибка", { 
        description: friendRequestStatus[error] ?? error 
      });
    }

    toast.success(friendRequestStatus[status]);

    const currentPath = router.state.location.pathname;

    if (currentPath === '/friends') {
      myFriendsDataAtom(ctx, (state) => state.filter(target => target.nickname !== variables.recipient))
      updateFriendsCount(ctx, "remove")
    } else {
      friendStatusesAtom(ctx, (state) => ({
        ...state,
        [variables.recipient]: { friend_id: null, status: "not-friend", request_id: null }
      }))

      ctx.schedule(() => router.invalidate())
    }
  }
}).pipe(withStatusesAtom())