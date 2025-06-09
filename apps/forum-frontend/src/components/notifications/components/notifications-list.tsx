import { notificationsAction, notificationsDataAtom, notificationsMetaAtom } from "#components/notifications/models/notifications.model";
import { Typography } from "@repo/ui/src/components/typography";
import dayjs from "@repo/lib/constants/dayjs-instance";
import { checkNotificationAction } from "#components/notifications/models/notifications.model";
import { Separator } from "@repo/ui/src/components/separator";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { forumUserClient } from "@repo/shared/api/forum-client";
import type { InferResponseType } from "hono/client";
import { Fragment } from "react/jsx-runtime";
import { updateNotificationsAction } from "#components/notifications/models/notifications.model";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { ContentNotFound } from "#components/templates/components/content-not-found";
import { onConnect } from "@reatom/framework";
import { reatomComponent } from "@reatom/npm-react";
import { IconInfoSquareRounded } from "@tabler/icons-react";

const client = forumUserClient.user["get-user-notifications"].$get

type NotificationCardProps = InferResponseType<typeof client, 200>["data"][number]

const NotificationCard = reatomComponent<NotificationCardProps>(({
  ctx, created_at, id, message, read
}) => {
  const date = dayjs(created_at).fromNow()

  return (
    <div
      className="flex justify-center items-center p-4 bg-shark-700/40 select-none hover:bg-shark-700 relative rounded-md gap-4 w-full"
      onMouseEnter={() => { !read && checkNotificationAction(ctx, id) }}
    >
      <IconInfoSquareRounded size={48} className="text-shark-300" />
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
}, "NotificationCard")

onConnect(notificationsDataAtom, notificationsAction)

export const NotificationsList = reatomComponent(({ ctx }) => {
  const { inView, ref } = useInView({ triggerOnce: false, threshold: 1 });

  const data = ctx.spy(notificationsDataAtom)
  const meta = ctx.spy(notificationsMetaAtom)
  const isLoading = ctx.spy(notificationsAction.statusesAtom).isPending

  const isLoadingUpdated = ctx.spy(checkNotificationAction.statusesAtom).isPending

  const hasMore = meta?.hasNextPage;

  useEffect(() => {
    if (inView && hasMore) updateNotificationsAction(ctx, { type: "update-cursor" });
  }, [inView, hasMore]);

  if (data?.length === 0) return <ContentNotFound title="Нет уведомлений" />;

  return (
    <div className="flex flex-col gap-y-4 w-full h-full">
      {isLoading && (
        <>
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </>
      )}
      {data && (
        <div className="flex flex-col gap-y-4 w-full h-fit">
          {data.map((notification, idx) => (
            <Fragment key={notification.id}>
              <NotificationCard key={notification.id} {...notification} />
              {idx < data.length - 1 && <Separator />}
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
}, "NotificationsList")