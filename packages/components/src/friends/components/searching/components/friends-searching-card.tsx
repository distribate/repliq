import Link from 'next/link';
import { USER_URL } from '@repo/shared/constants/routes.ts';
import { Avatar } from '../../../../user/components/avatar/components/avatar.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { UserDonate } from '../../../../user/components/donate/components/donate.tsx';
import { Tables } from '@repo/types/entities/supabase.ts';
import { FriendsSearchingCardAction } from './friends-searching-card-action.tsx';

export type FriendsSearchingCardProps = Pick<Tables<'users'>, 'id'
  | 'nickname'
  | 'name_color'
  | 'uuid'
  | 'created_at'
  | "description"
>

export const FriendsSearchingCard = ({
  nickname, created_at, id, uuid, name_color, description
}: FriendsSearchingCardProps) => {
  return (
    <Link key={id} href={USER_URL + nickname} passHref={true}>
      <div
        className="flex flex-col group gap-4 items-center
         duration-150 w-full h-[220px] bg-shark-950
         border hover:bg-shark-900 border-shark-800 rounded-md py-2 px-4"
      >
        <div className="relative">
          <Avatar nickname={nickname} propWidth={128} propHeight={128} />
          <FriendsSearchingCardAction nickname={nickname} />
        </div>
        <div className="flex flex-col items-start gap-1 w-full justify-start font-[Minecraft]">
          <div className="flex items-center gap-2">
            <Typography className="text-lg font-medium">
              {nickname}
            </Typography>
            <UserDonate nickname={nickname} />
          </div>
          {description && (
            <Typography textSize="small" className="text-shark-300">
              {description.length >=22 ? description?.slice(0, 22) + "..." : description}
            </Typography>
          )}
        </div>
      </div>
    </Link>
  );
};