import { AsyncCtx, reatomAsync, withCache, withDataAtom, withErrorAtom, withStatusesAtom } from '@reatom/async';
import { atom } from '@reatom/core';
import { sharedClient } from "#shared/forum-client"
import { validateResponse } from '#shared/api/validation';

export type AlertsPayload = Awaited<ReturnType<typeof getAlerts>>

export type AlertsPayloadData = AlertsPayload["data"]

export const alertsLimitAtom = atom(1, "alertsLimit")
export const alertsCursorAtom = atom<string | undefined>(undefined, "alertsCursor")
export const alertsAscendingAtom = atom<boolean>(false, "alertsAscending")

export async function getAlerts(
  { cursor, limit, ascending }: { cursor?: string, limit?: number, ascending: boolean },
  init?: RequestInit
) {
  const res = await sharedClient.shared["alerts"].$get({
    query: {
      limit: limit ? limit.toString() : undefined,
      cursor,
      ascending: `${ascending}`
    }
  }, {
    init
  })

  return validateResponse<typeof res>(res);
}

export const alertsAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(() => alertsFn(ctx))
}, "alertsAction").pipe(withDataAtom(), withStatusesAtom(), withCache(), withErrorAtom())

async function alertsFn(ctx: AsyncCtx) {
  const opts = {
    cursor: ctx.get(alertsCursorAtom),
    limit: ctx.get(alertsLimitAtom),
    ascending: ctx.get(alertsAscendingAtom)
  }

  return getAlerts(opts, { signal: ctx.controller.signal })
}