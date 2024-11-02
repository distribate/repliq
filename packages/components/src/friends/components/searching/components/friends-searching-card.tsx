import { USER_URL } from '@repo/shared/constants/routes.ts';
import { Avatar } from '#user/components/avatar/components/avatar.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { UserDonate } from '#user/components/donate/components/donate.tsx';
import { ExtendedUserEntity } from '@repo/types/entities/entities-type.ts';
import { UserNickname } from '#user/components/name/components/nickname.tsx';
import { FriendButton } from '#profile/components/cover/components/add-friend/components/friend-button.tsx';
import { Button } from '@repo/ui/src/components/button.tsx';
import { useRouter } from 'next/navigation';

export type FriendsSearchingCardProps = Pick<ExtendedUserEntity, 'id'
  | 'nickname' | 'name_color' | 'description' | 'donate'
>

export const FriendsSearchingCard = ({
  nickname, id, name_color, description, donate,
}: FriendsSearchingCardProps) => {
  const { push } = useRouter();
  
  return (
    <div className="flex flex-col group gap-4 justify-between items-center h-[280px] friend-card">
      <Avatar nickname={nickname} propWidth={128} propHeight={128} />
      <div className="flex flex-col items-start gap-1 w-full justify-start">
        <div className="flex items-center gap-2">
          <UserNickname nickname={nickname} nicknameColor={name_color} />
          <UserDonate nickname={nickname} existingDonate={donate} />
        </div>
        <div className="flex items-center w-full">
          {description && (
            <Typography textSize="small" className="text-shark-300 truncate">
              {description}
            </Typography>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 *:w-full w-full">
        <FriendButton reqUserNickname={nickname} />
        <Button state="default" className="!w-2/5" onClick={() => push(USER_URL + nickname)}>
          К профилю
        </Button>
      </div>
    </div>
  );
};