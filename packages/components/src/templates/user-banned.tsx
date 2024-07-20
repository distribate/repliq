import { PromiseBanDetails } from '@repo/lib/helpers/get-ban-details.ts';

type UserBannedProps = PromiseBanDetails

export const UserBanned = ({
  nickname, reason, time
}: UserBannedProps) => {
  return (
    <div>
      Пользователь {nickname} был заблокирован за нарушение правил проекта.
      {reason}
      {time}
    </div>
  )
}