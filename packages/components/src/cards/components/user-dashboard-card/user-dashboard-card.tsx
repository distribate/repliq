import { Tables } from '@repo/types/entities/supabase.ts';
import { Avatar } from '../../../user/components/avatar/components/avatar.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';

type UserDashboardCardProps = Pick<Tables<"users">, "nickname"
  | "id"
  | "uuid"
  | "name_color"
  | "created_at"
>

export const UserDashboardCard = ({
  nickname, id, uuid, name_color, created_at
}: UserDashboardCardProps) => {
  return (
    <div className="flex items-center w-full p-2 bg-shark-900 rounded-lg border border-white/10">
      <div className="flex gap-2">
        <Avatar nickname={nickname} propHeight={18} propWidth={18} />
        <Typography>{nickname}</Typography>
      </div>
    </div>
  )
}