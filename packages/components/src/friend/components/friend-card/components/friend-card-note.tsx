import { useControlFriend } from '../../request-card/hooks/use-control-friend.ts';
import { SelectedWrapper } from '../../../../wrappers/selected-wrapper.tsx';
import { X } from 'lucide-react';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { FriendCardProps } from '../friend-card.tsx';

type FriendCardNoteProps = Pick<FriendCardProps, 'friend_id' | 'nickname'> & {
  note: string | null
}

export const FriendCardNote = ({
  note, friend_id, nickname: reqUserNickname,
}: FriendCardNoteProps) => {
  const { setFriendUnNoteMutation } = useControlFriend();
  
  return (
    <div className="flex items-end gap-2">
      <SelectedWrapper
        className="relative -bottom-1"
        onClick={() => setFriendUnNoteMutation.mutate({
          friend_id, reqUserNickname
        })}
      >
        <X className="text-red-500" size={16} />
      </SelectedWrapper>
      <Typography className="text-shark-300" textSize="medium">
        {note}
      </Typography>
    </div>
  );
};