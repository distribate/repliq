import { AsyncCtx, reatomAsync, withErrorAtom, withStatusesAtom } from '@reatom/async';
import { userClient } from '#shared/forum-client';
import { isParamChanged, requestedUserParamAtom } from '#components/profile/main/models/requested-user.model';
import { log } from '#lib/utils';
import { validateResponse } from '#shared/api/validation';
import { profileThreadsSearchQueryAtom } from './profile-threads-settings.model';
import { atom, batch, Ctx } from '@reatom/core';
import { withReset } from '@reatom/framework';
import { createFabric } from '#shared/models/infinity-scroll.model';

type ProfileThreadsPayload = Awaited<ReturnType<typeof getThreadsUser>>;

export type ProfileThreadsPayloadData = ProfileThreadsPayload["data"]
export type ProfileThreadsPayloadMeta = ProfileThreadsPayload["meta"]

export const profileThreadsDataAtom = atom<ProfileThreadsPayloadData | null>(null, "profileThreadsData").pipe(withReset())
export const profileThreadsMetaAtom = atom<ProfileThreadsPayloadMeta | null>(null, "profileThreadsMeta").pipe(withReset())

export const profileThreadsCursorAtom = atom<string | undefined>(undefined, "profileThreadsCursor")

function resetProfileThreads(ctx: Ctx) {
  profileThreadsDataAtom.reset(ctx)
  profileThreadsMetaAtom.reset(ctx)
}

export async function getThreadsUser(
  nickname: string,
  { searchQuery }: { searchQuery?: string },
  init?: RequestInit
) {
  const res = await userClient.user["user-threads"][":nickname"].$get(
    { param: { nickname }, query: { searchQuery } }, { init }
  )

  return validateResponse<typeof res>(res);
}

requestedUserParamAtom.onChange((ctx, state) => isParamChanged(ctx, requestedUserParamAtom, state, () => {
  resetProfileThreads(ctx)
  log("profile threads reset for", state)
}))

export const profileThreadsAction = reatomAsync(async (ctx) => {
  const nickname = ctx.get(requestedUserParamAtom)
  if (!nickname) throw new Error("Nickname is not defined")

  return await ctx.schedule(() => profileThreadsFn(ctx, nickname))
}, {
  name: "profileThreadsAction",
  onFulfill: (ctx, res) => {
    batch(ctx, () => {
      profileThreadsDataAtom(ctx, res.data)
      profileThreadsMetaAtom(ctx, res.meta)
    })
  },
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
}).pipe(withStatusesAtom(), withErrorAtom())

async function profileThreadsFn(ctx: AsyncCtx, nickname: string) {
  const opts = {
    searchQuery: ctx.get(profileThreadsSearchQueryAtom),
    cursor: ctx.get(profileThreadsCursorAtom)
  }

  const result = await ctx.schedule(
    () => getThreadsUser(nickname, opts, { signal: ctx.controller.signal })
  );

  return result
}

export const profileThreadsFabric = createFabric<ProfileThreadsPayloadData[number], ProfileThreadsPayloadMeta>({
  name: 'profileThreads',
  fn: (ctx) => {
    const nickname = ctx.get(requestedUserParamAtom)
    if (!nickname) throw new Error("Nickname is not defined")
    return profileThreadsFn(ctx, nickname)
  },
  atoms: {
    dataAtom: profileThreadsDataAtom,
    metaAtom: profileThreadsMetaAtom,
    cursorAtom: profileThreadsCursorAtom,
  },
  viewerOpts: {
    threshold: 1
  },
  key: "id"
});

export const updateProfileThreadsAction = profileThreadsFabric.update;
export const ProfileThreadsViewer = profileThreadsFabric.Viewer;
export const isViewAtom = profileThreadsFabric.isViewAtom
export const isExistAtom = profileThreadsFabric.isExistAtom