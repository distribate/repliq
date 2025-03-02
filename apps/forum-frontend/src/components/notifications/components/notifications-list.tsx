import { notificationsQuery } from "#components/notifications/queries/notifications-query.ts";
import { Typography } from "@repo/ui/src/components/typography";
import dayjs from "@repo/lib/constants/dayjs-instance";
import Bell from "@repo/assets/images/minecraft/bell.webp";
import { useNotification } from "#components/notifications/hooks/use-notification.ts";
import { Separator } from "@repo/ui/src/components/separator";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { forumUserClient } from "@repo/shared/api/forum-client";
import type { InferResponseType } from "hono/client";
import { Fragment } from "react/jsx-runtime";
import { UPDATE_NOTIFICATIONS_MUTATION_KEY, useUpdateNotifications } from "#components/notifications/hooks/use-update-notifications.ts";
import { useInView } from "react-intersection-observer";
import { useMutationState } from "@tanstack/react-query";
import { useEffect } from "react";
import { ContentNotFound } from "#components/templates/content-not-found.tsx";

const client = forumUserClient.user["get-user-notifications"].$get

type NotificationCardProps = InferResponseType<typeof client, 200>["data"][number]

const NotificationCard = ({
  created_at, id, message, read, type
}: NotificationCardProps) => {
  const date = dayjs(created_at).fromNow()
  const { checkNotificationMutation } = useNotification()

  return (
    <div
      className="flex justify-center items-center p-4 bg-shark-700/40 select-none hover:bg-shark-700 relative rounded-md gap-4 w-full"
      onMouseEnter={() => checkNotificationMutation.mutate(id)}
    >
      <div className="w-[64px]">
        <img src={Bell} alt="" width={64} height={64} />
      </div>
      <div className="flex flex-col justify-start w-full">
        <Typography className="truncate text-[18px]">
          {message}
        </Typography>
        <Typography textColor="gray" className="text-[14px]">
          {date}
        </Typography>
      </div>
      {!read && (
        <div className="w-[16px] h-[16px] rounded-[999px] bg-red-500 absolute top-4 right-4" />
      )}
    </div>
  )
}

export const NotificationsList = () => {
  const { data, isLoading } = notificationsQuery()
  const { updateNotificationsMutation } = useUpdateNotifications()
  const { inView, ref } = useInView({ triggerOnce: false, threshold: 1 });

  const mutData = useMutationState({
    filters: { mutationKey: UPDATE_NOTIFICATIONS_MUTATION_KEY },
    select: m => m.state.status
  })

  const isLoadingUpdated = mutData[mutData.length - 1] === "pending";

  const notifications = data?.data
  const notificationsMeta = data?.meta
  const hasMore = notificationsMeta?.hasNextPage;

  useEffect(() => {
    if (inView && hasMore) updateNotificationsMutation.mutate({ type: "update-cursor" });
  }, [inView, hasMore]);

  if (notifications?.length === 0) return <ContentNotFound title="Нет уведомлений" />;

  return (
    <div className="flex flex-col gap-y-4 p-2 w-full h-full">
      {isLoading && (
        <>
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </>
      )}
      {notifications && (
        <div className="flex flex-col gap-y-4 w-full h-fit">
          {notifications.map((notification, idx) => (
            <Fragment key={notification.id}>
              <NotificationCard key={notification.id} {...notification} />
              {idx < notifications.length - 1 && <Separator />}
            </Fragment>
          ))}
          {isLoadingUpdated && (
            <>
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </>
          )}
          {hasMore && <div ref={ref} className="h-[1px] w-full" />}
        </div>
      )}
    </div>
  )
}