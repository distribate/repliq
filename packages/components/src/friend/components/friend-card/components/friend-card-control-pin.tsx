import { DropdownMenuItem } from '@repo/ui/src/components/dropdown-menu.tsx';
import { Pin } from 'lucide-react';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { useControlFriend } from '#friend/components/friend-card/hooks/use-control-friend.ts';
import { FriendCardControlProps } from '#friend/components/friend-card/components/friend-card-control.tsx';

type FriendCardControlPinProps = Pick<FriendCardControlProps, "isPinned" | "nickname">

export const FriendCardControlPin = ({
  isPinned, nickname: reqUserNickname
}: FriendCardControlPinProps) => {
  const { setFriendPinnedMutation, setFriendUnpinMutation } = useControlFriend();
  
  const handlePin = () => {
    if (isPinned) {
      return setFriendUnpinMutation.mutate({ reqUserNickname })
    } else {
      return setFriendPinnedMutation.mutate({ reqUserNickname })
    }
  }
  
  return (
    <DropdownMenuItem
      onClick={handlePin}
      className="flex justify-start items-center gap-2 group"
    >
      <Pin size={16} className="text-shark-300" />
      {isPinned ? (
        <Typography textSize="small" className="text-caribbean-green-500">
          Открепить
        </Typography>
      ) : (
        <Typography textSize="small">
          Закрепить
        </Typography>
      )}
    </DropdownMenuItem>
  );
};