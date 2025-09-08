import { withHistory } from '#lib/with-history';
import { withReset } from '@reatom/framework';
import { reatomAsync, withStatusesAtom } from '@reatom/async';
import { atom } from '@reatom/core';
import { userClient } from "#shared/forum-client";
import dayjs from "@repo/shared/constants/dayjs-instance";
import { validateResponse } from '#shared/api/validation';

type UserStatus = {
  status: "online" | "offline";
  issuedTime: string | null
}

export const formatIssuedTime = (issuedDate: string | null) => {
  if (!issuedDate) return "Никогда не заходил";

  const issued = dayjs(issuedDate);

  const diffInDays = dayjs().diff(issued, 'day');

  if (diffInDays === 0) {
    // today
    return issued.format("Оффлайн. Был в HH:mm");
  }

  if (diffInDays === 1) {
    // yesterday
    return issued.format("Оффлайн. Был вчера в HH:mm");
  }

  if (diffInDays < 120) {
    // less than 30 days
    return issued.format("Оффлайн. Был D MMM в HH:mm");
  }

  // more than 120 days
  return `Оффлайн. Был давно`;
};

export const userStatusAtom = atom<UserStatus | null>(null, "userStatus").pipe(withReset())
export const userStatusParamAtom = atom<string | null>(null, "userStatusParamAtom").pipe(withHistory(1), withReset())

userStatusParamAtom.onChange((ctx, state) => {
  if (!state) return;

  const prev = ctx.get(userStatusParamAtom.history)[1]

  if (prev !== undefined && prev !== state) {
    userStatusAtom.reset(ctx)
  }

  userStatusAction(ctx, state)
})

export const userStatusAction = reatomAsync(async (ctx, nickname: string) => {
  return await ctx.schedule(async () => {
    const res = await userClient.user["user-status"][":nickname"].$get({ param: { nickname } })
    return validateResponse<typeof res>(res);
  })
}, {
  name: "userStatusAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
  onFulfill: (ctx, res) => {
    if (res) {
      const issuedTime = formatIssuedTime(res.created_at ?? null)
      userStatusAtom(ctx, { status: res.status, issuedTime })
    }
  }
}).pipe(withStatusesAtom())