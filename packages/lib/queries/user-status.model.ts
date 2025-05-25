import { withHistory } from '@repo/lib/utils/with-history';
import { withReset } from '@reatom/framework';
import { isParamChanged, requestedUserParamAtom } from '../../../apps/forum-frontend/src/components/profile/requested-user.model';
import { reatomAsync, withCache, withDataAtom, withStatusesAtom } from '@reatom/async';
import { atom } from '@reatom/core';
import { formatIssuedTime } from "#helpers/format-status-time.ts";
import { forumUserClient } from "@repo/shared/api/forum-client";
import consola from 'consola';

async function getUserStatus(nickname: string) {
  const res = await forumUserClient.user["get-user-status"][":nickname"].$get({ param: { nickname } })
  const data = await res.json()

  if (!data || "error" in data) return null;

  return data.data;
}

type UserStatus = { status: "online" | "offline"; issuedTime: string | null }

export const userStatusAtom = atom<UserStatus | null>(null, "userStatus").pipe(withReset())

export const userStatusParamAtom = atom<string | null>(null, "userStatusParamAtom").pipe(withHistory(1))

userStatusParamAtom.onChange((ctx, state) => {
  if (!state) {
    return
  }
  userStatusAction(ctx, state)
  consola.info("userStatusParamAtom", state);

  const prev = ctx.get(userStatusParamAtom.history)[1]

  if (prev !== undefined && prev !== state) {
    userStatusAtom.reset(ctx)
  }
})

export const userStatusAction = reatomAsync(async (ctx, target: string) => {
  return await ctx.schedule(() => getUserStatus(target))
}, {
  name: "userStatusAction",
  onFulfill: (ctx, res) => {
    if (res) {
      const issuedTime = formatIssuedTime(res.created_at ?? null)
      userStatusAtom(ctx, { status: res.status, issuedTime })
    }
  }
}).pipe(withStatusesAtom())