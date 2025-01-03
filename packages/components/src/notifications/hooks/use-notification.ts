import { checkNotification } from "#notifications/queries/check-notification.ts";
import { NOTIFICATIONS_QUERY_KEY } from "#notifications/queries/notifications-query.ts";
import { Notifications } from "@repo/types/db/forum-database-types";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Selectable } from "kysely"

export const useNotification = () => {
  const qc = useQueryClient()

  const checkNotificationMutation = useMutation({
    mutationFn: async (notification_id: string) => {
      const currentNotifications = qc.getQueryData<Selectable<Notifications>[]>(NOTIFICATIONS_QUERY_KEY)

      const currentNotification = currentNotifications?.find(notification => notification.id === notification_id)

      if (currentNotification?.read) return;

      return checkNotification(notification_id)
    },
    onSuccess: async (data, variables) => {
      if (!data) return;

      const currentNotifications = qc.getQueryData<Selectable<Notifications>[]>(NOTIFICATIONS_QUERY_KEY)

      if (!currentNotifications) {
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

      return qc.setQueryData(NOTIFICATIONS_QUERY_KEY, updatedNotifications)
    },
    onError: (e) => {
      throw new Error(e.message)
    },
  })

  return { checkNotificationMutation }
}