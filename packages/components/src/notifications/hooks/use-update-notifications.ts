import { getNotifications, GetNotificationsResponse } from "#notifications/queries/get-notifications.ts";
import { NOTIFICATIONS_FILTER_QUERY_KEY, NotificationsFilterQuery } from "#notifications/queries/notifications-filter-query.ts";
import { NOTIFICATIONS_QUERY_KEY } from "#notifications/queries/notifications-query.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const UPDATE_NOTIFICATIONS_MUTATION_KEY = ["update-notifications-mutation"];

type UseUpdateNotifications = {
  type: "update-filter" | "update-cursor"
}

export const useUpdateNotifications = () => {
  const qc = useQueryClient();

  const updateNotificationsMutation = useMutation({
    mutationKey: UPDATE_NOTIFICATIONS_MUTATION_KEY,
    mutationFn: async ({ type }: UseUpdateNotifications) => {
      const filtering = qc.getQueryData<NotificationsFilterQuery>(NOTIFICATIONS_FILTER_QUERY_KEY)

      if (!filtering) return;

      return getNotifications({ ...filtering })
    },
    onSuccess: async (data, variables) => {
      if (!data) {
        const currentNotifications = qc.getQueryData<GetNotificationsResponse>(NOTIFICATIONS_QUERY_KEY);

        return { data: currentNotifications?.data, meta: currentNotifications?.meta };
      }

      if (variables.type === "update-filter") {
        qc.setQueryData(NOTIFICATIONS_QUERY_KEY, data)

        return qc.setQueryData(NOTIFICATIONS_FILTER_QUERY_KEY, (prev: NotificationsFilterQuery) => ({
          ...prev, cursor: undefined,
        }));
      }

      qc.setQueryData(NOTIFICATIONS_FILTER_QUERY_KEY, (prev: NotificationsFilterQuery) => ({
        ...prev, cursor: data.meta?.endCursor,
      }));

      qc.setQueryData(NOTIFICATIONS_QUERY_KEY, (prev: GetNotificationsResponse) => {
        if (!prev) {
          return { data: data.data, meta: data.meta };
        }

        const newNotifications = data.data.filter(
          notification => !prev.data.some(exist => exist.id === notification.id)
        );

        return { data: [...prev.data, ...newNotifications], meta: data.meta };
      });
    }
  })

  return { updateNotificationsMutation }
}