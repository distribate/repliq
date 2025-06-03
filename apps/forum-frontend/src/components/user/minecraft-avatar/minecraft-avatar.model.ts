import { reatomAsync } from '@reatom/async';
import { atom } from '@reatom/framework';
import { getSkinDetails } from '@repo/lib/queries/get-skin-details';

export const minecraftAvatarsUrlsAtom = atom<Record<string, string>>({}, "avatarsUrlsAtom");
export const minecraftAvatarsStatusesAtom = atom<Record<string, boolean>>({}, "avatarsStatusesAtom");

export const minecraftAvatarAtom = (nickname: string) => atom((ctx) => {
  return {
    url: ctx.spy(minecraftAvatarsUrlsAtom)[nickname],
    isLoading: ctx.spy(minecraftAvatarsStatusesAtom)[nickname]
  };
}, `minecraft-avatar.${nickname}`)

export const minecraftAvatarAction = reatomAsync(async (ctx, target: string) => {
  if (ctx.get(minecraftAvatarsUrlsAtom)[target] !== undefined) {
    return
  }

  minecraftAvatarsStatusesAtom(ctx, (state) => ({ ...state, [target]: true }))

  const url = await ctx.schedule(() => getSkinDetails({ nickname: target, type: "head" }));

  return { url, target };
}, {
  name: "minecraftAvatarAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    minecraftAvatarsUrlsAtom(ctx, (state) => ({ ...state, [res.target]: res.url! }));
    minecraftAvatarsStatusesAtom(ctx, (state) => ({ ...state, [res.target]: false }));
  }
})