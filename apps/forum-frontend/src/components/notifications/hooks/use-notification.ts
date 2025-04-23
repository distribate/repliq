import { GetNotificationsResponse } from "#components/notifications/queries/get-notifications.ts";
import { NOTIFICATIONS_QUERY_KEY } from "#components/notifications/queries/notifications-query.ts";
import { USER_GLOBAL_OPTIONS_QUERY_KEY } from "@repo/lib/queries/user-global-options-query";
import { forumUserClient } from "@repo/shared/api/forum-client";
import { useMutation, useQueryClient } from "@tanstack/react-query"

const checkNotification = async (notification_id: string) => {
  const res = await forumUserClient.user["check-notification"].$post({
    json: {
      notification_id
    }
  })

  const data = await res.json()

  if (!data || "error" in data) {
    return { error: data.error };
  }

  return data;
}

export const useNotification = () => {
  const qc = useQueryClient()

  const checkNotificationMutation = useMutation({
    mutationFn: async (notification_id: string) => {
      const currentNotifications = qc.getQueryData<GetNotificationsResponse>(NOTIFICATIONS_QUERY_KEY)?.data

      const currentNotification = currentNotifications?.find(notification => notification.id === notification_id)

      if (currentNotification?.read) return;

      return checkNotification(notification_id)
    },
    onSuccess: async (data, variables) => {
      if (!data) return;

      const currentNotifications = qc.getQueryData<GetNotificationsResponse>(NOTIFICATIONS_QUERY_KEY)

      if (!currentNotifications?.data) {
        return;
      }
      
      const updatedNotifications = [...currentNotifications.data]; 
      const indexToUpdate = updatedNotifications.findIndex(notification => notification.id === variables);

      if (indexToUpdate !== -1) {
        updatedNotifications[indexToUpdate] = {
          ...updatedNotifications[indexToUpdate], 
          read: true,
        };
      }
      
      const checkedNotifications = currentNotifications.data.filter(notification => notification.read === false)

      if (!checkedNotifications || checkedNotifications?.length <= 1) {
        qc.invalidateQueries({ queryKey: USER_GLOBAL_OPTIONS_QUERY_KEY })
      }

      return qc.setQueryData(NOTIFICATIONS_QUERY_KEY, (prev: GetNotificationsResponse) => ({ ...prev, data: updatedNotifications }))
    },
    onError: (e) => {
      throw new Error(e.message)
    },
  })

  return { checkNotificationMutation }
}