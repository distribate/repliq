import { toast } from "sonner";
import { ControlFriendProperties, ControlFriendRequests } from "#components/friend/models/control-friend.model";
import { friendsCountAction } from "#components/friends/models/friends-count.model.ts";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { atom, batch, Ctx } from "@reatom/core";
import { incomingRequestsAtom, outgoingRequestsAtom } from "#components/friends/models/friends-requests.model.ts";
import { friendClient } from '#shared/api/forum-client';
import { friendStatusesAtom } from "./friend-status.model";
import { myFriendsAction, myFriendsDataAtom } from "#components/friends/models/friends.model";
import { sleep, withReset } from "@reatom/framework";
import { currentUserAtom } from "#components/user/models/current-user.model";
import { pageContextAtom } from "#shared/lib/context-sync";
import { validateResponse } from "#shared/api/validation";
import dayjs from "@repo/shared/constants/dayjs-instance";

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

export const removeFriendDialogIsOpenAtom = atom(false, "removeFriendDialogIsOpen")
export const removeFriendOptionsAtom = atom<{ nickname: string, friend_id: string } | null>(null, "removeFriendOptions").pipe(withReset())

async function deleteFriendRequest({ request_id }: Pick<ControlFriendRequest, "request_id">) {
  const res = await friendClient.friend["remove-request"].$post({ json: { request_id } })
  return validateResponse<typeof res>(res);
}

async function createFriendRequest({ recipient }: Pick<ControlFriendRequest, "recipient">) {
  const res = await friendClient.friend["create-request"].$post({ json: { recipient } })
  return validateResponse<typeof res>(res);
}

async function acceptFriendRequest({ request_id }: Pick<ControlFriendRequest, "request_id">) {
  const res = await friendClient.friend["accept-request"].$post({ json: { request_id } })
  return validateResponse<typeof res>(res);
}

async function updateFriends(ctx: Ctx) {
  myFriendsDataAtom.reset(ctx);
  await myFriendsAction(ctx)
}

export const controlOutgoingRequestAction = reatomAsync(async (ctx, values: ControlOutgoingRequest) => {
  const event = {
    "create": async () => createFriendRequest({ recipient: values.recipient }),
    "reject": async () => deleteFriendRequest({ request_id: values.request_id })
  }

  const result = await ctx.schedule(() => event[values.type]())

  return { result, values: { recipient: values.recipient, type: values.type } }
}, {
  name: "controlOutgoingRequestAction",
  onFulfill: async (ctx, res) => {
    const {
      result: { data: { request_id }, status },
      values: { type, recipient }
    } = res;

    const pageContext = ctx.get(pageContextAtom)
    if (!pageContext) return;

    if (type === 'reject') {
      if (pageContext.urlPathname === '/friends') {
        outgoingRequestsAtom(ctx, (state) => {
          if (!state) state = [];

          const newList = state.filter(target => target.id !== request_id);

          return newList
        })

        friendsCountAction.dataAtom(ctx, (state) => {
          if (!state) return null;

          const newMeta = {
            ...state,
            requestsCount: {
              ...state.requestsCount,
              outgoing: state.requestsCount.outgoing - 1
            }
          }

          return newMeta
        })
      }

      friendStatusesAtom(ctx, (state) => ({
        ...state,
        [recipient]: {
          status: "not-friend",
          request_id: null,
          friend_id: null
        }
      }))
    }

    if (type === 'create') {
      if (pageContext.urlPathname === '/friends') {
        const currentUser = ctx.get(currentUserAtom)
        if (!currentUser) throw new Error('Current user is not defined')

        const newOutgoingRequest = {
          id: request_id,
          initiator: currentUser.nickname,
          recipient,
          created_at: dayjs().toString(),
          avatar: currentUser.avatar,
          name_color: currentUser.name_color
        }

        batch(ctx, async () => {
          outgoingRequestsAtom(ctx, (state) => {
            if (!state) state = []

            const newRequests = [...state, newOutgoingRequest]

            return newRequests
          })

          friendsCountAction.dataAtom(ctx, (state) => {
            if (!state) return null;

            const newMeta = {
              ...state,
              requestsCount: {
                ...state.requestsCount,
                outgoing: state.requestsCount.outgoing + 1
              }
            }

            return newMeta
          })

          await updateFriends(ctx)
        })
      }

      friendStatusesAtom(ctx, (state) => ({
        ...state,
        [recipient]: {
          status: "reject-request",
          request_id,
          friend_id: null
        }
      }))
    }

    toast.success(friendRequestStatus[status]);
  },
  onReject: (_, e) => {
    if (e instanceof Error) {
      const description = friendRequestStatus[e.message] ?? e.message;
      toast.error("Произошла ошибка", { description });
    }
  },
}).pipe(withStatusesAtom())

export const controlIncomingRequestAction = reatomAsync(async (ctx, values: ControlIncomingRequest) => {
  const event = {
    "accept": async () => acceptFriendRequest({ request_id: values.request_id }),
    "reject": async () => deleteFriendRequest({ request_id: values.request_id })
  }

  const result = await ctx.schedule(() => event[values.type]())

  return { result, values }
}, {
  name: "controlIncomingRequestAction",
  onFulfill: (ctx, res) => {
    const {
      result: { data, status },
      values: { recipient, request_id, type }
    } = res;

    const pageContext = ctx.get(pageContextAtom)
    if (!pageContext) return;

    if (type === 'accept') {
      if (pageContext.urlPathname === '/friends') {
        batch(ctx, async () => {
          incomingRequestsAtom(ctx, (state) => {
            if (!state) state = []

            const newRequests = state.filter(target => target.id !== request_id)

            return newRequests
          })

          friendsCountAction.dataAtom(ctx, (state) => {
            if (!state) return null;

            const newMeta = {
              ...state,
              friendsCount: state.friendsCount + 1,
              requestsCount: {
                ...state.requestsCount,
                incoming: state.requestsCount.incoming - 1
              }
            }

            return newMeta
          })

          await updateFriends(ctx)
        })
      }

      if ("friend_id" in data) {
        const { friend_id } = data;

        console.log(friend_id);

        friendStatusesAtom(ctx, (state) => ({
          ...state,
          [recipient]: {
            status: "friend",
            friend_id,
            request_id: null
          }
        }))
      }
    }

    if (type === 'reject') {
      if (pageContext.urlPathname === '/friends') {
        let request_id: string | null = null;

        if ("request_id" in data) {
          request_id = data.request_id
        }

        if (!request_id) {
          throw new Error("Request id is not defined")
        }

        batch(ctx, async () => {
          incomingRequestsAtom(ctx, (state) => {
            if (!state) state = []
  
            const newRequests = state.filter(target => target.id !== request_id)
  
            return newRequests
          })
  
          friendsCountAction.dataAtom(ctx, (state) => {
            if (!state) return null;
  
            const newMeta = {
              ...state,
              requestsCount: {
                ...state.requestsCount,
                incoming: state.requestsCount.incoming - 1
              }
            }
    
            return newMeta
          })
  
          await updateFriends(ctx)
        })
      }

      friendStatusesAtom(ctx, (state) => ({
        ...state,
        [recipient]: {
          status: "not-friend",
          friend_id: null,
          request_id: null,
        }
      }))
    }

    toast.success(friendRequestStatus[status]);
  },
  onReject: (_, e) => {
    if (e instanceof Error) {
      const description = friendRequestStatus[e.message] ?? e.message;
      toast.error("Произошла ошибка", { description });
    }
  },
}).pipe(withStatusesAtom())

export const removeFriendAction = reatomAsync(async (ctx, values: ControlFriendProperties) => {
  const result = await ctx.schedule(async () => {
    const res = await friendClient.friend["remove"].$delete({
      json: { friend_id: values.friend_id }
    })

    return validateResponse<typeof res>(res);
  })

  return { result, values }
}, {
  name: "removeFriendAction",
  onFulfill: async (ctx, res) => {
    const {
      result: { data, status },
      values: { recipient }
    } = res

    const pageContext = ctx.get(pageContextAtom)
    if (!pageContext) return;

    if (pageContext.urlPathname === '/friends') {
      batch(ctx, () => {
        myFriendsDataAtom(ctx, (state) => {
          if (!state) state = []
  
          const newList = state.filter(target => target.nickname !== recipient);
  
          return newList
        })
  
        friendsCountAction.dataAtom(ctx, (state) => {
          if (!state) return null;
  
          const newMeta = {
            ...state,
            friendsCount: state.friendsCount - 1,
          }
  
          return newMeta
        })
      })
    }

    batch(ctx, () => {
      friendStatusesAtom(ctx, (state) => ({
        ...state,
        [recipient]: {
          friend_id: null,
          status: "not-friend",
          request_id: null
        }
      }))
  
      removeFriendDialogIsOpenAtom(ctx, false)
    })

    await ctx.schedule(() => sleep(300))

    removeFriendOptionsAtom.reset(ctx)

    toast.success(friendRequestStatus[status]);
  },
  onReject: (_, e) => {
    if (e instanceof Error) {
      const description = friendRequestStatus[e.message] ?? e.message;
      toast.error("Произошла ошибка", { description });
    }
  },
}).pipe(withStatusesAtom())