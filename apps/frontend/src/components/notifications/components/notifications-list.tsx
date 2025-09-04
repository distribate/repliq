import dayjs from "@repo/shared/constants/dayjs-instance";
import { isViewAtom, notificationsAction, notificationsDataAtom, resetNotifications } from "#components/notifications/models/notifications.model";
import { Typography } from "@repo/ui/src/components/typography";
import { checkNotificationAction } from "#components/notifications/models/notifications.model";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { userClient } from "#shared/forum-client";
import type { InferResponseType } from "hono/client";
import { updateNotificationsAction } from "#components/notifications/models/notifications.model";
import { useInView } from "react-intersection-observer";
import { ContentNotFound } from "#components/templates/components/content-not-found";
import { atom, onConnect, onDisconnect } from "@reatom/framework";
import { reatomComponent, useUpdate } from "@reatom/npm-react";
import { IconInfoSquareRounded } from "@tabler/icons-react";
import { SectionSkeleton } from "#components/templates/components/section-skeleton";

const client = userClient.user["get-user-notifications"].$get

type NotificationCardProps = InferResponseType<typeof client, 200>["data"][number]

const NotificationCard = reatomComponent<NotificationCardProps>(({
  ctx, created_at, id, message, read
}) => {
  const date = dayjs(created_at).fromNow()

  return (
    <div
      className="flex justify-start items-start p-2 min-h-20 max-h-36 sm:p-3 lg:p-4 bg-shark-900/40 select-none hover:bg-shark-700 relative rounded-md gap-3 w-full"
      onMouseEnter={() => { !read && checkNotificationAction(ctx, id) }}
    >
      <div className="w-[36px]">
        <IconInfoSquareRounded size={36} className="text-shark-300" />
      </div>
      <div className="flex flex-col justify-start w-fit">
        <Typography className="truncate text-wrap text-base lg:text-lg">
          {message}
        </Typography>
        <Typography textColor="gray" className="text-sm">
          {date}
        </Typography>
      </div>
      {!read && (
        <div className="w-[16px] h-[16px] rounded-[999px] bg-green-600 absolute top-4 right-4" />
      )}
    </div>
  )
}, "NotificationCard")

const NotificationsSkeleton = () => {
  return (
    <>
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
    </>
  )
}

const Viewer = reatomComponent(({ ctx }) => {
  const { inView, ref } = useInView({ triggerOnce: false, threshold: 1 });

  useUpdate((ctx) => isViewAtom(ctx, inView), [inView])

  const isExist = ctx.spy(isExistAtom)
  if (!isExist) return null;

  return <div ref={ref} className="h-[1px] w-full" />
}, "Viewer")

const isExistAtom = atom((ctx) => {
  const target = ctx.spy(notificationsDataAtom)
  return target ? target.length >= 1 : false
}, "isExistAtom")

const UpdatedSkeleton = reatomComponent(({ ctx }) => {
  if (!ctx.spy(updateNotificationsAction.statusesAtom).isPending) {
    return null;
  }

  return <NotificationsSkeleton />
}, "UpdatedSkeleton")

const List = reatomComponent(({ ctx }) => {
  const data = ctx.spy(notificationsDataAtom)
  const isExist = ctx.spy(isExistAtom)

  if (ctx.spy(notificationsAction.statusesAtom).isPending) {
    return <SectionSkeleton />
  }

  if (!data || !isExist) {
    return <ContentNotFound title="Нет уведомлений" />
  }

  return (
    <>
      {data.map((notification) => (
        <NotificationCard key={notification.id} {...notification} />
      ))}
      <UpdatedSkeleton />
    </>
  )
}, "List")

onConnect(notificationsDataAtom, notificationsAction)
onDisconnect(notificationsDataAtom, (ctx) => resetNotifications(ctx));

export const NotificationsList = () => {
  return (
    <div className="flex flex-col items-start gap-4 w-full">
      <List />
      <Viewer />
    </div>
  )
}