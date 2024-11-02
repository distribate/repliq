import { Button } from '@repo/ui/src/components/button.tsx';
import { Plus, RotateCcw } from 'lucide-react';
import { FriendRequestProperties } from '#friend/components/friend-card/types/friend-request-types.ts';
import { useControlFriendRequests } from '#friend/components/friend-card/hooks/use-control-friend-requests.ts';

export const FriendsSearchingCardActionDeny = ({
  recipient
}: Pick<FriendRequestProperties, "recipient">) => {
  const { rejectOutgoingRequestMutation } = useControlFriendRequests()
  
  const handleDeniedFriendReq = () => {
    return rejectOutgoingRequestMutation.mutate(recipient)
  }
  
  return (
    <Button
      onClick={handleDeniedFriendReq}
      variant="pending"
      className="!p-2 rounded-lg"
      disabled={rejectOutgoingRequestMutation.isPending || rejectOutgoingRequestMutation.isError}
    >
      <RotateCcw size={20} className="text-shark-950" />
    </Button>
  );
};

export const FriendsSearchingCardActionAdd = ({
  recipient
}: Pick<FriendRequestProperties, "recipient">) => {
  const { createRequestFriendMutation } = useControlFriendRequests();
  
  const handleAddFriend = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    return createRequestFriendMutation.mutate(recipient);
  };
  
  return (
    <Button
      onClick={handleAddFriend}
      variant="positive"
      className="!p-2 rounded-lg"
      disabled={createRequestFriendMutation.isPending || createRequestFriendMutation.isError}
    >
      <Plus size={20} className="text-shark-950" />
    </Button>
  );
};