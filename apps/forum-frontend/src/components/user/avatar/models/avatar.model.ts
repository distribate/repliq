import { atom } from '@reatom/framework';

export const avatarsUrlsAtom = atom<Record<string, string | null>>({}, "avatarsUrlsAtom");
export const avatarsStatusesAtom = atom<Record<string, boolean>>({}, "avatarsStatusesAtom");

export const avatarAtom = (nickname: string) => atom((ctx) => {
  return {
    url: ctx.spy(avatarsUrlsAtom)[nickname],
    isLoading: ctx.spy(avatarsStatusesAtom)[nickname]
  };
}, `avatar.${nickname}`)