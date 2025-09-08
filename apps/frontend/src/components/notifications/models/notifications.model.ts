import { atom, batch, Ctx } from "@reatom/core"
import { AsyncCtx, reatomAsync, withStatusesAtom } from "@reatom/async"
import { userClient } from "#shared/forum-client"
import { userGlobalOptionsAtom } from "#components/user/models/current-user.model"
import { withReset } from "@reatom/framework"
import { createFabric } from "#shared/models/infinity-scroll.model"
import { validateResponse } from "#shared/api/validation"

export type NotificationsPayload = Awaited<ReturnType<typeof notificationsAction>>;

type NotificationsPayloadData = NotificationsPayload["data"]
type NotificationsPayloadMeta = NotificationsPayload["meta"]

type NotificationsOpts = {
  type: "system" | "requests" | "news",
  cursor?: string
}

export const notificationsDataAtom = atom<NotificationsPayloadData | null>(null, "notificationsData").pipe(withReset())
export const notificationsMetaAtom = atom<NotificationsPayloadMeta | null>(null, "notificationsMeta").pipe(withReset())
export const notificationsAscendingAtom = atom(false, "notificationsAscending")
export const notificationsLimitAtom = atom(16, "notificationsLimit")

export const notificationsTypeAtom = atom<"system" | "requests" | "news">("system", "notificationsType")
export const notificationsCursorAtom = atom<string | undefined>(undefined, "notificationsCursor")

notificationsTypeAtom.onChange((ctx, state) => {
  notificationsCursorAtom(ctx, undefined)
  updateNotificationsAction(ctx, "update-filter")
})

notificationsMetaAtom.onChange((ctx, target) => {
  notificationsCursorAtom(ctx, target?.endCursor)
})

export function resetNotifications(ctx: Ctx) {
  batch(ctx, () => {
    notificationsDataAtom.reset(ctx);
    notificationsMetaAtom.reset(ctx);
  })
}

async function getNotifications(
  { type, cursor }: NotificationsOpts,
  init?: RequestInit
) {
  const res = await userClient.user["notification"]["notifications"].$get(
    { query: { type, cursor, } }, { init }
  )

  return validateResponse<typeof res>(res)
}

export const notificationsAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(() => notificationsFn(ctx))
}, {
  name: "notificationsAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    batch(ctx, () => {
      notificationsDataAtom(ctx, res.data)
      notificationsMetaAtom(ctx, res.meta)
    })
  },
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
}).pipe(withStatusesAtom())

export const checkNotificationAction = reatomAsync(async (ctx, notificationId: string) => {
  const currentNotifications = ctx.get(notificationsDataAtom)

  const currentNotification = currentNotifications?.find(notification => notification.id === notificationId)
  if (currentNotification?.read)  return

  const result = await ctx.schedule(async () => {
    const res = await userClient.user["notification"]["check"].$post(
      { json: { notification_id: notificationId } }
    )

    return validateResponse<typeof res>(res)
  })

  return { result, notificationId }
}, {
  name: "checkNotificationAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    const { result, notificationId } = res;

    const currentNotifications = ctx.get(notificationsDataAtom)
    if (!currentNotifications) return;

    const updatedNotifications = [...currentNotifications];
    const indexToUpdate = updatedNotifications.findIndex(notification => notification.id === notificationId);

    if (indexToUpdate !== -1) {
      updatedNotifications[indexToUpdate] = {
        ...updatedNotifications[indexToUpdate],
        read: true
      };
    }

    const checkedNotifications = currentNotifications.filter(notification => notification.read === false)

    if (!checkedNotifications || checkedNotifications?.length <= 1) {
      userGlobalOptionsAtom(ctx, (state) => ({ ...state, has_new_notifications: false }))
    }

    notificationsDataAtom(ctx, updatedNotifications)
  },
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
}).pipe(withStatusesAtom())

async function notificationsFn(ctx: AsyncCtx) {
  const opts = {
    type: ctx.get(notificationsTypeAtom),
    cursor: ctx.get(notificationsCursorAtom)
  }

  const result = await ctx.schedule(
    () => getNotifications(opts, { signal: ctx.controller.signal })
  );

  return result
}

const notificationsFabric = createFabric<NotificationsPayloadData[number], NotificationsPayloadMeta>({
  name: 'notifications',
  fn: notificationsFn,
  atoms: {
    dataAtom: notificationsDataAtom,
    metaAtom: notificationsMetaAtom,
    cursorAtom: notificationsCursorAtom,
  },
  viewerOpts: {
    threshold: 1
  },
  key: "id"
});

export const updateNotificationsAction = notificationsFabric.update;
export const NotificationsViewer = notificationsFabric.Viewer;
export const isViewAtom = notificationsFabric.isViewAtom
export const isExistAtom = notificationsFabric.isExistAtom