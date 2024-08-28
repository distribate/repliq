import { Button } from '@repo/ui/src/components/button.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { MoreWrapper } from '../../../../wrappers/more-wrapper.tsx';
import { DropdownMenuItem } from '@repo/ui/src/components/dropdown-menu.tsx';
import { Pin, Tag } from 'lucide-react';
import { FriendCardProps } from '../friend-card.tsx';
import {
  DeleteFriendModal,
} from '../../../../modals/action-confirmation/components/delete-friend/components/delete-friend-modal.tsx';
import { UserCardModal } from '../../../../modals/custom/user-card-modal.tsx';
import { useControlFriend } from '../../request-card/hooks/use-control-friend.ts';
import { FriendCardControlNote } from './friend-card-control-note.tsx';

export const FriendCardControl = ({
  nickname: reqUserNickname, friend_id, isPinned,
}: Pick<FriendCardProps, 'friend_id' | 'nickname' | 'isPinned'>) => {
  const { setFriendPinnedMutation, setFriendUnpinMutation } = useControlFriend();
  
  return (
    <div className="flex items-center mt-2 gap-1 w-fit">
      <DeleteFriendModal
        friend_id={friend_id}
        nickname={reqUserNickname}
        trigger={
          <Button
            asChild
            variant="negative"
          >
            <Typography textSize="small">
              Удалить из друзей
            </Typography>
          </Button>
        }
      />
      <MoreWrapper>
        <UserCardModal
          nickname={reqUserNickname}
          withCustomTrigger={true}
          trigger={
            <DropdownMenuItem className="flex justify-start items-center gap-2 group">
              <Tag size={16} className="text-shark-300" />
              <Typography textSize="small">
                Показать карточку профиля
              </Typography>
            </DropdownMenuItem>
          }
        />
        {isPinned ? (
          <DropdownMenuItem
            onClick={() => setFriendUnpinMutation.mutate({
              reqUserNickname,
            })}
            className="flex justify-start items-center gap-2 group"
          >
            <Pin size={16} className="text-shark-300" />
            <Typography textSize="small" className="text-caribbean-green-500">
              Открепить
            </Typography>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => setFriendPinnedMutation.mutate({
              reqUserNickname,
            })}
            className="flex justify-start items-center gap-2 group"
          >
            <Pin size={16} className="text-shark-300" />
            <Typography textSize="small">
              Закрепить
            </Typography>
          </DropdownMenuItem>
        )}
        <FriendCardControlNote nickname={reqUserNickname}/>
      </MoreWrapper>
    </div>
  );
};