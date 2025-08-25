import { toast } from "sonner";
import { ControlFriendProperties, ControlFriendRequests } from "#components/friend/models/control-friend.model";
import { friendsCountAction } from "#components/friends/models/friends-count.model.ts";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { atom, batch } from "@reatom/core";
import { incomingRequestsAtom, outgoingRequestsAtom } from "#components/friends/models/friends-requests.model.ts";
import { forumUserClient } from '#shared/forum-client.ts';
import { friendStatusesAtom } from "../components/friend-button/models/friend-status.model";
import { myFriendsAction, myFriendsDataAtom } from "#components/friends/models/friends.model";
import { withReset } from "@reatom/framework";
import { currentUserAtom, currentUserNicknameAtom } from "#components/user/models/current-user.model";
import { pageContextAtom } from "#lib/sync";
import dayjs from "dayjs";

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
const removeFriendActionVariablesAtom = atom<ControlFriendProperties | null>(null, "removeFriendActionVariables")

async function deleteFriendRequest({ request_id }: Pick<ControlFriendRequest, "request_id">) {
  const res = await forumUserClient.user["delete-friend-request"].$post({ json: { request_id } })
  const data = await res.json();
  if ("error" in data) throw new Error(data.error)

  return {
    request_id: null,
    status: data.status
  }
}

async function createFriendRequest({ recipient }: Pick<ControlFriendRequest, "recipient">) {
  const res = await forumUserClient.user["create-friend-request"].$post({ json: { recipient } })
  const data = await res.json();
  if ("error" in data) throw new Error(data.error)

  return {
    request_id: data.request_id,
    status: data.status
  }
}

async function acceptFriendRequest({ request_id }: Pick<ControlFriendRequest, "request_id">) {
  const res = await forumUserClient.user["accept-friend-request"].$post({ json: { request_id } })
  const data = await res.json();
  if ("error" in data) throw new Error(data.error)

  return {
    status: data.status,
    friend_id: data.friend_id
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
  onReject: (_, e) => {
    if (e instanceof Error) {
      const description = friendRequestStatus[e.message] ?? e.message;
      toast.error("Произошла ошибка", { description });
    }
  },
  onFulfill: async (ctx, data) => {
    const pageContext = ctx.get(pageContextAtom)
    const variables = ctx.get(controlOutgoingRequestVariablesAtom)

    if (!variables || !pageContext) return;

    toast.success(friendRequestStatus[data.status]);

    if (variables.type === 'reject') {
      if (pageContext.urlPathname === '/friends') {
        outgoingRequestsAtom(ctx, (state) => {
          if (!state) state = []
          return state.filter(target => target.recipient !== variables.recipient)
        })

        friendsCountAction.dataAtom(ctx, (state) => {
          if (!state) return null;

          return {
            ...state,
            requestsCount: {
              ...state.requestsCount,
              outgoing: state.requestsCount.outgoing - 1
            }
          }
        })
      } else {
        friendStatusesAtom(ctx, (state) => ({
          ...state,
          [variables.recipient]: {
            request_id: null,
            status: "not-friend",
            friend_id: null
          }
        }))
      }
    }

    if (variables.type === 'create') {
      if (pageContext.urlPathname === '/friends') {
        batch(ctx, () => {
          outgoingRequestsAtom(ctx, (state) => {
            if (!state) state = []

            const newRequest = {
              id: data.request_id!,
              initiator: ctx.get(currentUserNicknameAtom)!,
              recipient: variables.recipient,
              created_at: dayjs().toString(),
              avatar: ctx.get(currentUserAtom)?.avatar ?? null,
              name_color: ctx.get(currentUserAtom)?.name_color ?? "#FFFFFF"
            }

            return [...state, newRequest]
          })

          friendsCountAction.dataAtom(ctx, (state) => {
            if (!state) return null;

            return {
              ...state,
              requestsCount: {
                ...state.requestsCount,
                outgoing: state.requestsCount.outgoing + 1
              }
            }
          })

          myFriendsAction(ctx)
        })
      } else {
        friendStatusesAtom(ctx, (state) => ({
          ...state,
          [variables.recipient]: {
            request_id: data.request_id,
            status: "reject-request",
            friend_id: null
          }
        }))
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
  onReject: (_, e) => {
    if (e instanceof Error) {
      const description = friendRequestStatus[e.message] ?? e.message;
      toast.error("Произошла ошибка", { description });
    }
  },
  onFulfill: (ctx, data) => {
    const pageContext = ctx.get(pageContextAtom)
    const variables = ctx.get(controlIncomingRequestVariablesAtom);

    if (!variables || !pageContext) return;

    toast.success(friendRequestStatus[data.status]);

    if (variables.type === 'accept') {
      if (pageContext.urlPathname === '/friends') {
        batch(ctx, () => {
          incomingRequestsAtom(ctx, (state) => {
            if (!state) state = []

            return state.filter(target => target.recipient !== variables.recipient)
          })

          friendsCountAction.dataAtom(ctx, (state) => {
            if (!state) return null;

            return {
              ...state,
              friendsCount: state.friendsCount + 1,
              requestsCount: {
                ...state.requestsCount,
                incoming: state.requestsCount.incoming - 1
              }
            }
          })
          
          myFriendsAction(ctx)
        })
      } else {
        if ("friend_id" in data) {
          friendStatusesAtom(ctx, (state) => ({
            ...state,
            [variables.recipient]: {
              friend_id: data.friend_id!,
              status: "friend",
              request_id: null
            }
          }))
        }
      }
    }

    if (variables.type === 'reject') {
      if (pageContext.urlPathname === '/friends') {
        incomingRequestsAtom(ctx, (state) => {
          if (!state) state = []

          return state.filter(target => target.recipient !== variables.recipient)
        })

        friendsCountAction.dataAtom(ctx, (state) => {
          if (!state) return null;

          return {
            ...state,
            requestsCount: {
              ...state.requestsCount,
              incoming: state.requestsCount.incoming - 1
            }
          }
        })
      } else {
        friendStatusesAtom(ctx, (state) => ({
          ...state,
          [variables.recipient]: {
            friend_id: null,
            status: "not-friend",
            request_id: null
          }
        }))
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

export const removeFriendAction = reatomAsync(async (ctx, options: ControlFriendProperties) => {
  removeFriendActionVariablesAtom(ctx, options)
  return await ctx.schedule(async () => {
    const res = await forumUserClient.user["delete-friend"].$delete({
      json: { friend_id: options.friend_id }
    })

    const data = await res.json();

    if ("error" in data) throw new Error(data.error)

    return data.status
  })
}, {
  name: "removeFriendAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      const description = friendRequestStatus[e.message] ?? e.message;
      toast.error("Произошла ошибка", { description });
    }
  },
  onFulfill: (ctx, status) => {
    const pageContext = ctx.get(pageContextAtom)
    const variables = ctx.get(removeFriendActionVariablesAtom)

    if (!variables || !pageContext) return;

    toast.success(friendRequestStatus[status]);

    if (pageContext.urlPathname === '/friends') {
      myFriendsDataAtom(ctx, (state) => {
        if (!state) state = []
        return state.filter(target => target.nickname !== variables.recipient)
      })
      friendsCountAction(ctx)
    } else {
      friendStatusesAtom(ctx, (state) => ({
        ...state,
        [variables.recipient]: {
          friend_id: null,
          status: "not-friend",
          request_id: null
        }
      }))
    }
  }
}).pipe(withStatusesAtom())