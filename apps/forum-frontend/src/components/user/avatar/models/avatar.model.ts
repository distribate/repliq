import { getSkinDetails } from '@repo/lib/queries/get-skin-details';
import { reatomAsync } from '@reatom/async';
import { atom } from '@reatom/framework';

export const avatarsUrlsAtom = atom<Record<string, string>>({}, "avatarsUrlsAtom");
export const avatarsStatusesAtom = atom<Record<string, boolean>>({}, "avatarsStatusesAtom");

export const avatarAtom = (nickname: string) => atom((ctx) => {
  return {
    url: ctx.spy(avatarsUrlsAtom)[nickname], 
    isLoading: ctx.spy(avatarsStatusesAtom)[nickname] 
  };
}, `avatar.${nickname}`)

export const avatarAction = reatomAsync(async (ctx, target: string) => {
  if (ctx.get(avatarsUrlsAtom)[target]) {
    return
  }

  avatarsStatusesAtom(ctx, (state) => ({ ...state, [target]: true }))

  const url = await ctx.schedule(() => getSkinDetails({ type: 'head', nickname: target }));

  return { url: url ?? null, target };
}, {
  name: "avatarAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    avatarsUrlsAtom(ctx, (state) => ({ ...state, [res.target]: res.url! }));
    avatarsStatusesAtom(ctx, (state) => ({ ...state, [res.target]: false }));
  }
})