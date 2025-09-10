import { withHistory } from '#shared/helpers/with-history';
import { withReset } from '@reatom/framework';
import { reatomAsync, withStatusesAtom } from '@reatom/async';
import { atom } from '@reatom/core';
import { userClient } from "#shared/forum-client";
import { validateResponse } from '#shared/api/validation';
import dayjs from "@repo/shared/constants/dayjs-instance";

type UserActivityStatus = {
  status: "online" | "offline";
  issuedTime: string | null
}

export const userActivityStatusAtom = atom<UserActivityStatus | null>(null, "userActivityStatus").pipe(withReset())
export const userActivityStatusParamAtom = atom<string | null>(null, "userActivityStatusParam").pipe(withHistory(1), withReset())

userActivityStatusParamAtom.onChange((ctx, state) => {
  if (!state) return;

  const prev = ctx.get(userActivityStatusParamAtom.history)[1]

  if (prev !== undefined && prev !== state) {
    userActivityStatusAtom.reset(ctx)
  }

  userActivityStatusAction(ctx, state)
})

export const userActivityStatusAction = reatomAsync(async (ctx, nickname: string) => {
  return await ctx.schedule(async () => {
    const res = await userClient.user["user-activity-status"][":nickname"].$get(
      { param: { nickname } },
      { init: { signal: ctx.controller.signal } }
    )
    return validateResponse<typeof res>(res);
  })
}, {
  name: "userActivityStatusAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    const issuedTime = formatIssuedTime(res.payload)

    userActivityStatusAtom(ctx, { status: res.status, issuedTime })
  },
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
}).pipe(withStatusesAtom())

function formatIssuedTime(issuedDate: string | null) {
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