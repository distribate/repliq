import { atom, batch, Ctx } from "@reatom/core"
import { reatomAsync, withStatusesAtom } from "@reatom/async"
import { forumUserClient } from "#shared/forum-client"
import type { InferResponseType } from "hono/client"
import { userGlobalOptionsAtom } from "#components/user/models/current-user.model"
import { withReset } from "@reatom/framework"

export const notificationsDataAtom = atom<GetNotificationsResponse["data"] | null>(null, "notificationsData").pipe(withReset())
export const notificationsMetaAtom = atom<GetNotificationsResponse["meta"] | null>(null, "notificationsMeta").pipe(withReset())

export const notificationsTypeAtom = atom<"system" | "requests" | "news">("system", "notificationsType")
export const notificationsCursorAtom = atom<string | undefined>(undefined, "notificationsCursor")

notificationsTypeAtom.onChange((ctx, state) => {
  notificationsCursorAtom(ctx, undefined)
  updateNotificationsAction(ctx, "update-filter")
})

notificationsMetaAtom.onChange((ctx, target) => {
  notificationsCursorAtom(ctx, target?.endCursor)
})

type GetNotifications = {
  type: "system" | "requests" | "news",
  cursor?: string
}

const client = forumUserClient.user["get-user-notifications"].$get

export type GetNotificationsResponse = InferResponseType<typeof client, 200>

export function resetNotifications(ctx: Ctx) {
  notificationsDataAtom.reset(ctx);
  notificationsMetaAtom.reset(ctx);
}

export const getNotifications = async (
  { type, cursor }: GetNotifications,
  init?: RequestInit
) => {
  const res = await forumUserClient.user["get-user-notifications"].$get(
    { query: { type, cursor, } }, { init }
  )

  const data = await res.json()

  if ('error' in data) throw new Error(data.error)

  return data
}

export const notificationsAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(() => getNotifications(
    { type: "system" }, { signal: ctx.controller.signal })
  )
}, {
  name: "notificationsAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
  onFulfill: (ctx, res) => {
    if (!res) return;

    batch(ctx, () => {
      notificationsDataAtom(ctx, res.data)
      notificationsMetaAtom(ctx, res.meta)
    })
  }
}).pipe(withStatusesAtom())

type UpdateNotificationsType = "update-filter" | "update-cursor"

const updateNotificationsActionVariablesAtom = atom<UpdateNotificationsType>("update-cursor", "updateNotificationsActionVariables")

export const updateNotificationsAction = reatomAsync(async (ctx, option: UpdateNotificationsType) => {
  updateNotificationsActionVariablesAtom(ctx, option)

  const type = ctx.get(notificationsTypeAtom)

  const args = {
    cursor: ctx.get(notificationsCursorAtom),
    type
  }

  return await ctx.schedule(() => getNotifications(args, { signal: ctx.controller.signal }))
}, {
  name: "updateNotificationsAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
  onFulfill: (ctx, res) => {
    if (!res) return

    const variables = ctx.get(updateNotificationsActionVariablesAtom)
    if (!variables) return;

    if (variables === "update-filter") {
      batch(ctx, () => {
        notificationsDataAtom(ctx, res.data)
        notificationsMetaAtom(ctx, res.meta)
        notificationsCursorAtom(ctx, undefined)
      })

      return;
    }

    batch(ctx, () => {
      notificationsCursorAtom(ctx, res.meta?.endCursor)

      notificationsDataAtom(ctx, (state) => {
        if (!state) return null;

        const newData = res.data.filter(
          notification => !state.some(exist => exist.id === notification.id)
        )

        return [...state, ...newData]
      })

      notificationsMetaAtom(ctx, res.meta)
    })
  }
}).pipe(withStatusesAtom())

const checkNotificationActionVariablesAtom = atom<string | null>(null, "checkNotificationActionVariables")

export const checkNotificationAction = reatomAsync(async (ctx, notificationId: string) => {
  const currentNotifications = ctx.get(notificationsDataAtom)
  checkNotificationActionVariablesAtom(ctx, notificationId)

  const currentNotification = currentNotifications?.find(notification => notification.id === notificationId)
  if (currentNotification?.read) return;

  return await ctx.schedule(async () => {
    const res = await forumUserClient.user["check-notification"].$post(
      { json: { notification_id: notificationId } }
    )

    const data = await res.json()
    if ("error" in data) throw new Error(data.error)

    return data;
  })
}, {
  name: "checkNotificationAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
  onFulfill: (ctx, res) => {
    if (!res) return;

    const currentNotifications = ctx.get(notificationsDataAtom)
    const variables = ctx.get(checkNotificationActionVariablesAtom)

    if (!currentNotifications || !variables) return;

    const updatedNotifications = [...currentNotifications];
    const indexToUpdate = updatedNotifications.findIndex(notification => notification.id === variables);

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
  }
}).pipe(withStatusesAtom())

export const isViewAtom = atom(false, "isView")

isViewAtom.onChange((ctx, state) => {
  if (!state) return;

  const hasMore = ctx.get(notificationsMetaAtom)?.hasNextPage ?? false;
  if (!hasMore) return;

  updateNotificationsAction(ctx, "update-cursor")
})