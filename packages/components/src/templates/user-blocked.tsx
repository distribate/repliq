import { ProfileStatusBlockedType } from '@repo/lib/helpers/check-profile-status.ts';
import { Typography } from '@repo/ui/src/components/typography.tsx';

export type UserBlockedProps = {
  blockedType: ProfileStatusBlockedType
}

export const UserBlocked = ({
  blockedType
}: UserBlockedProps) => {
  return (
    <div>
      <Typography>
        {blockedType === 'user-blocked' ? (
          `Вы добавили данного пользователя в черный список`
        ) : (
          `Данный пользователь добавил вас в черный список`
        )}
      </Typography>
    </div>
  )
}