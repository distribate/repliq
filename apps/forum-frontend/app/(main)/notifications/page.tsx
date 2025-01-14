import { NotificationsList } from "@repo/components/src/notifications/components/notifications-list.tsx";
import { Typography } from "@repo/ui/src/components/typography";

export const metadata = {
  title: "Уведомления"
}

export default async function NotificationsPage() {
  return (
    <div className="flex flex-col items-center justify-center p-6 gap-4 w-full h-full">
      <div className="flex flex-col items-center w-full">
        <Typography className="text-[24px] font-semibold">
          Уведомления
        </Typography>
        <Typography className="text-[16px]" textColor="gray">
          самое важное к прочтению
        </Typography>
      </div>
      <div className="flex h-full overflow-hidden w-3/5">
        <NotificationsList />
      </div>
    </div>
  )
}