import { Typography } from '@repo/ui/src/components/typography.tsx';
import Link from 'next/link';
import { Ellipsis } from 'lucide-react';
import { CURRENT_USER_QUERY_KEY } from '@repo/lib/queries/current-user-query.ts';
import { useControlFriend } from '../../../profile/components/cover/components/add-friend/hooks/use-control-friend.ts';
import { Avatar } from '../../../user/components/avatar/components/avatar.tsx';
import { UserDonate } from '../../../user/components/donate/components/donate.tsx';
import { useQueryClient } from '@tanstack/react-query';
import { USER } from '@repo/types/entities/entities-type.ts';
import { UserNickname } from '../../../user/components/name/components/nickname.tsx';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { DropdownWrapper } from '../../../wrappers/dropdown-wrapper.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { UserCardModal } from '../../../modals/user-card-modal.tsx';

type FriendCardProps = {
  nickname: string,
  reqUserNickname: string
}

export const FriendCard = ({
  nickname, reqUserNickname,
}: FriendCardProps) => {
  const qc = useQueryClient();
  const currentUser = qc.getQueryData<USER>(CURRENT_USER_QUERY_KEY);
  
  const { removeFriendFromListMutation } = useControlFriend();
  
  if (!currentUser) return null;
  
  const handleDeleteFriend = () => {
    removeFriendFromListMutation.mutate({
      currentUserNickname: currentUser.nickname,
      requestedUserNickname: reqUserNickname,
    });
  };
  
  const isOwner = currentUser.nickname === reqUserNickname;
  
  return (
    <div className="flex flex-col gap-y-4 w-full bg-shark-900 *:px-4 py-4 rounded-md">
      <div className="flex items-start justify-between w-full">
        <div className="flex gap-2 items-center">
          <Avatar propHeight={46} propWidth={46} nickname={nickname} />
          <div className="flex flex-col">
            <Link href={`/user/${nickname}`}>
              <UserNickname
                nickname={nickname}
                nicknameColor={`#ffffff`}
                className="text-base font-medium text-shark-50"
              />
            </Link>
            <div className="w-fit">
              <UserDonate nickname={nickname} />
            </div>
          </div>
        </div>
        {isOwner && (
          <div className="w-fit">
            <DropdownWrapper
              properties={{ contentAlign: 'start', sideAlign: 'right' }}
              trigger={<Ellipsis size={20} className="text-shark-300 cursor-pointer" />}
              content={
                <div onClick={handleDeleteFriend} className="flex flex-col gap-y-1 w-full items-center">
                  <HoverCardItem className="gap-1 group">
                    <Typography>
                      Удалить из друзей
                    </Typography>
                  </HoverCardItem>
                </div>
              }
            />
          </div>
        )}
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