import { reatomAsync, withCache, withStatusesAtom } from "@reatom/async";
import { atom, CtxSpy } from "@reatom/core";
import { currentUserNicknameAtom } from "#components/user/models/current-user.model";
import { userClient } from "#shared/forum-client";

type FriendStatus = {
  status: "friend" | "not-accepted-friend" | "not-friend" | "reject-request" | "accept-request";
  friend_id: string | null;
  request_id: string | null
}

const getUserFriendStatus = async (
  recipient: string,
  init?: RequestInit
) => {
  const res = await userClient.user["get-friend-status"][":nickname"].$get({ param: { nickname: recipient } }, { init })
  const data = await res.json();
  if ("error" in data) throw new Error(data.error)
  return data.data
}

export const friendStatusesAtom = atom<Record<string, FriendStatus>>({}, "friendStatusesAtom")

export const getFriendStatusesAtom = (ctx: CtxSpy, nickname: string) =>
  ctx.spy(friendStatusesAtom)[nickname];

export const friendStatusAction = reatomAsync(async (ctx, target: string) => {
  const initiator = ctx.get(currentUserNicknameAtom)
  if (initiator === target) return;

  const data = await ctx.schedule(() => getUserFriendStatus(target, { signal: ctx.controller.signal }))

  return { target, data }
}, {
  name: "friendStatusAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
  onFulfill: (ctx, res) => {
    if (!res) return;

    const data = res.data
    if (!data) return;

    friendStatusesAtom(ctx, (state) => ({ ...state, [res.target]: data }))
  }
}).pipe(withStatusesAtom(), withCache({ swr: false }))