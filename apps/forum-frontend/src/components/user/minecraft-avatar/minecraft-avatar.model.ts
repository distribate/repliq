import { reatomAsync } from '@reatom/async';
import { atom } from '@reatom/framework';
import { skinClient } from '@repo/shared/api/minecraft-client.ts';
import ky from 'ky';

export const minecraftAvatarsUrlsAtom = atom<Record<string, string>>({}, "avatarsUrlsAtom");
export const minecraftAvatarsStatusesAtom = atom<Record<string, boolean>>({}, "avatarsStatusesAtom");

type GetSkinDetails = {
  type: "head" | "skin"
  nickname: string
}

export async function getSkinDetails({ type, nickname }: GetSkinDetails) {
  const url = skinClient.skin[`get-${type}`][":nickname"].$url({
    param: { nickname }
  })

  const blob = await ky.get(url).blob()

  return URL.createObjectURL(blob)
}

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