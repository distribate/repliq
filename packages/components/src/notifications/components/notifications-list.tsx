import { notificationsQuery } from "#notifications/queries/notifications-query.ts";
import { Typography } from "@repo/ui/src/components/typography";
import type { Notifications } from "@repo/types/db/forum-database-types.ts";
import type { Selectable } from "kysely";
import dayjs from "@repo/lib/constants/dayjs-instance";
import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes } from "react";
import Bell from "@repo/assets/images/minecraft/bell.webp";
import { useNotification } from "#notifications/hooks/use-notification.ts";

const notificationCardVariants = cva("flex select-none items-center rounded-md gap-2 w-full p-2", {
  variants: {
    variant: {
      checked: "bg-shark-700",
      notChecked: "bg-shark-400",
    },
  },
});

interface NotificationCardProps extends HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof notificationCardVariants> { }

const Card = ({
  className, variant, ...props
}: NotificationCardProps) => {
  return <div className={notificationCardVariants({ className, variant })} {...props} />
}

const NotificationCard = ({
  created_at, id, message, read
}: Selectable<Notifications>) => {
  const date = dayjs(created_at).fromNow()
  const { checkNotificationMutation } = useNotification()

  return (
    <Card
      title={`Создана ${date}`}
      variant={read ? "checked" : "notChecked"}
      onMouseEnter={() => checkNotificationMutation.mutate(id)}
    >
      <img src={Bell.src} alt="" width={24} height={24} />
      <Typography className="truncate">
        {message}
      </Typography>
    </Card>
  )
}

export const NotificationsList = () => {
  const { data: notifications } = notificationsQuery()

  return (
    <div className="flex flex-col gap-y-4 p-2 w-[300px] max-h-[400px] overflow-scroll h-full">
      <div className="flex flex-col w-full">
        <Typography className="text-[18px]">
          Уведомления
        </Typography>
        <Typography className="text-[14px]" textColor="gray">
          самое важное к прочтению
        </Typography>
      </div>
      {!notifications && (
        <Typography>Нет уведомлений</Typography>
      )}
      {notifications && (
        <div className="flex flex-col gap-y-2 w-full h-fit">
          {notifications.map(notification => (
            // @ts-ignore
            <NotificationCard key={notification.id} {...notification} />
          ))}
        </div>
      )}
    </div>
  )
}