import { atom } from "@reatom/core"
import { reatomAsync, withStatusesAtom } from "@reatom/async"
import { forumUserClient } from "#shared/forum-client"
import type { InferResponseType } from "hono/client"
import { userGlobalOptionsAtom } from "#components/user/models/current-user.model"

export const notificationsDataAtom = atom<GetNotificationsResponse["data"] | null>(null, "notificationsData")
export const notificationsMetaAtom = atom<GetNotificationsResponse["meta"] | null>(null, "notificationsMeta")

type GetNotifications = {
  type: "system" | "requests" | "news",
  cursor?: string
}

const client = forumUserClient.user["get-user-notifications"].$get

export type GetNotificationsResponse = InferResponseType<typeof client, 200>

export const getNotifications = async ({
  type, cursor
}: GetNotifications) => {
  const res = await forumUserClient.user["get-user-notifications"].$get({
    query: { type, cursor, }
  })

  const data = await res.json()

  if (!data || 'error' in data) {
    return null
  }

  return data
}

export const notificationsAction = reatomAsync(async (ctx) => {
  const res = await getNotifications({ type: "system" })

  if (!res) return null;

  notificationsFilterAtom(ctx, (state: NotificationsFilterQuery) => ({ ...state, cursor: res.meta?.endCursor }))

  return res;
}, {
  name: "notificationsAction",
  onFulfill: (ctx, res) => {
    if (res) {
      notificationsDataAtom(ctx, res.data)
      notificationsMetaAtom(ctx, res.meta)
    }
  }
}).pipe(withStatusesAtom())

type UpdateNotifications = {
  type: "update-filter" | "update-cursor"
}

const updateNotificationsActionVariablesAtom = atom<UpdateNotifications | null>(null, "updateNotificationsActionVariables")

export const updateNotificationsAction = reatomAsync(async (ctx, options: UpdateNotifications) => {
  const filtering = ctx.get(notificationsFilterAtom)
  if (!filtering) return;

  updateNotificationsActionVariablesAtom(ctx, options)

  return await getNotifications({ ...filtering })
}, {
  name: "updateNotificationsAction",
  onFulfill: (ctx, res) => {
    if (!res) {
      return
    }

    const variables = ctx.get(updateNotificationsActionVariablesAtom)
    if (!variables) return;

    if (variables.type === "update-filter") {
      notificationsDataAtom(ctx, res.data)
      notificationsMetaAtom(ctx, res.meta)
      notificationsFilterAtom(ctx, (state) => ({ ...state, cursor: undefined }))
      return;
    }

    notificationsFilterAtom(ctx, (state) => ({ ...state, cursor: res.meta?.endCursor, }))

    notificationsDataAtom(ctx, (state) => state ? (
      [
        ...state,
        ...res.data.filter(
          notification => !state.some(exist => exist.id === notification.id)
        )
      ]
    ) : null)

    notificationsMetaAtom(ctx, res.meta)
  }
})

export type NotificationsFilterQuery = {
  type: "system" | "requests" | "news"
  cursor?: string
}

export const notificationsFilterAtom = atom<NotificationsFilterQuery>({ type: "system" }, "notificationsFilter")

const checkNotification = async (notification_id: string) => {
  const res = await forumUserClient.user["check-notification"].$post({
    json: { notification_id }
  })

  const data = await res.json()

  if (!data || "error" in data) {
    return { error: data.error };
  }

  return data;
}

const checkNotificationActionVariablesAtom = atom<string | null>(null, "checkNotificationActionVariables")

export const checkNotificationAction = reatomAsync(async (ctx, notificationId: string) => {
  const currentNotifications = ctx.get(notificationsDataAtom)
  checkNotificationActionVariablesAtom(ctx, notificationId)
  
  const currentNotification = currentNotifications?.find(notification => notification.id === notificationId)

  if (currentNotification?.read) return;

  return await checkNotification(notificationId)
}, {
  name: "checkNotificationAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    const currentNotifications = ctx.get(notificationsDataAtom)
    const variables = ctx.get(checkNotificationActionVariablesAtom)

    if (!currentNotifications || !variables) {
      return;
    }

    const updatedNotifications = [...currentNotifications];
    const indexToUpdate = updatedNotifications.findIndex(notification => notification.id === variables);

    if (indexToUpdate !== -1) {
      updatedNotifications[indexToUpdate] = {
        ...updatedNotifications[indexToUpdate],
        read: true,
      };
    }

    const checkedNotifications = currentNotifications.filter(notification => notification.read === false)

    if (!checkedNotifications || checkedNotifications?.length <= 1) {
      userGlobalOptionsAtom(ctx, (state) => ({ ...state, has_new_notifications: false }))
    }

    notificationsDataAtom(ctx, updatedNotifications)
  }
}).pipe(withStatusesAtom())