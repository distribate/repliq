import { reatomAsync } from '@reatom/async';
import { atom } from '@reatom/framework';
import { forumUserClient } from '@repo/shared/api/forum-client';

export const avatarsUrlsAtom = atom<Record<string, string | null>>({}, "avatarsUrlsAtom");
export const avatarsStatusesAtom = atom<Record<string, boolean>>({}, "avatarsStatusesAtom");

export const avatarAtom = (nickname: string) => atom((ctx) => {
  return {
    url: ctx.spy(avatarsUrlsAtom)[nickname],
    isLoading: ctx.spy(avatarsStatusesAtom)[nickname]
  };
}, `avatar.${nickname}`)

async function getAvatar(nickname: string) {
  const res = await forumUserClient.user["get-user-avatar"][":nickname"].$get({
    param: { nickname }
  })
  const data = await res.json()

  if ("error" in data) {
    return null;
  }

  return data.data;
}

export const avatarAction = reatomAsync(async (ctx, target: string) => {
  if (ctx.get(avatarsUrlsAtom)[target] !== undefined) {
    return
  }

  avatarsStatusesAtom(ctx, (state) => ({ ...state, [target]: true }))

  const url = await ctx.schedule(() => getAvatar(target));

  return { url, target };
}, {
  name: "avatarAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    avatarsUrlsAtom(ctx, (state) => ({ ...state, [res.target]: res.url }));
    avatarsStatusesAtom(ctx, (state) => ({ ...state, [res.target]: false }));
  }
})