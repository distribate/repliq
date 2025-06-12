import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { atom, CtxSpy } from "@reatom/core";
import { currentUserNicknameAtom } from "#components/user/models/current-user.model";
import { forumUserClient } from "@repo/shared/api/forum-client";

type FriendStatus = {
  status: "friend" | "not-accepted-friend" | "not-friend" | "reject-request" | "accept-request";
  friend_id: string | null;
  request_id: string | null
}

const getUserFriendStatus = async (recipient: string) => {
  const res = await forumUserClient.user["get-friend-status"][":nickname"].$get({ param: { nickname: recipient } })
  const data = await res.json();
  if (!data || "error" in data) return null;
  return data.data
}

export const friendStatusesAtom = atom<Record<string, FriendStatus>>({}, "friendStatusesAtom")

export const getFriendStatusesAtom = (ctx: CtxSpy, nickname: string) =>
  ctx.spy(friendStatusesAtom)[nickname];

export const friendStatusAction = reatomAsync(async (ctx, target: string) => {
  const initiator = ctx.get(currentUserNicknameAtom)
  if (initiator === target) return;

  const data = await getUserFriendStatus(target)

  return { target, data }
}, {
  name: "friendStatusAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    const newData = res.data
    if (!newData) return;

    friendStatusesAtom(ctx, (state) => ({ ...state, [res.target]: newData }))
  }
}).pipe(withStatusesAtom())