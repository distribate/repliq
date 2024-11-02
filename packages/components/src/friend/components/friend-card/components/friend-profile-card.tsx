import { Typography } from '@repo/ui/src/components/typography.tsx';
import Link from 'next/link';
import { Avatar } from '#user/components/avatar/components/avatar.tsx';
import { UserDonate } from '#user/components/donate/components/donate.tsx';
import { UserNickname } from '#user/components/name/components/nickname.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { UserCardModal } from '#modals/custom/user-card-modal.tsx';
import { UserEntity } from '@repo/types/entities/entities-type.ts';
import { USER_URL } from '@repo/shared/constants/routes.ts';
import { getUser } from '@repo/lib/helpers/get-user.ts';

type FriendCardProps = Pick<UserEntity, "nickname" | "name_color">

export const FriendProfileCard = ({
  nickname, name_color
}: FriendCardProps) => {
  const currentUser = getUser();
  if (!currentUser) return null;
  
  return (
    <div className="flex flex-col gap-y-4 w-full bg-shark-950 border border-shark-800 *:px-4 py-4 rounded-lg">
      <div className="flex items-start justify-between w-full">
        <div className="flex gap-2 items-center">
          <Avatar propHeight={46} propWidth={46} nickname={nickname} />
          <div className="flex flex-col">
            <Link href={USER_URL + nickname}>
              <UserNickname
                nickname={nickname}
                nicknameColor={name_color}
                className="text-base font-medium text-shark-50"
              />
            </Link>
            <div className="w-fit">
              <UserDonate nickname={nickname} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <Typography className="text-shark-50 text-md">
          В игре: 5 дней 6 часов
        </Typography>
      </div>
      <Separator />
     <UserCardModal nickname={nickname}/>
    </div>
  );
};