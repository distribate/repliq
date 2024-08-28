import {
  RequestFriendProperties
} from '../../../../profile/components/cover/components/add-friend/types/request-friend-properties-type.ts';
import { useControlFriend } from '../../../../friend/components/request-card/hooks/use-control-friend.ts';
import { Button } from '@repo/ui/src/components/button.tsx';
import { Plus, RotateCcw } from 'lucide-react';

export const FriendsSearchingCardActionDeny = ({
  recipient
}: RequestFriendProperties) => {
  const { deleteRequestMutation } = useControlFriend()
  
  const handleDeniedFriendReq = () => {
    deleteRequestMutation.mutate({
      reqUserNickname: recipient
    })
  }
  
  return (
    <Button
      onClick={handleDeniedFriendReq}
      variant="pending"
      className="!p-2 rounded-lg"
      pending={deleteRequestMutation.isPending}
      disabled={deleteRequestMutation.isPending || deleteRequestMutation.isError}
    >
      <RotateCcw size={20} className="text-shark-950" />
    </Button>
  );
};

export const FriendsSearchingCardActionAdd = ({
  recipient
}: RequestFriendProperties) => {
  const { createRequestFriendMutation } = useControlFriend();
  
  const handleAddFriend = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    createRequestFriendMutation.mutate({
      reqUserNickname: recipient
    });
  };
  
  return (
    <Button
      onClick={handleAddFriend}
      variant="positive"
      className="!p-2 rounded-lg"
      pending={createRequestFriendMutation.isPending}
      disabled={createRequestFriendMutation.isPending || createRequestFriendMutation.isError}
    >
      <Plus size={20} className="text-shark-950" />
    </Button>
  );
};