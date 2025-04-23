import { Button } from "@repo/ui/src/components/button.tsx";
import { Plus, RotateCcw } from "lucide-react";
import { useControlFriendRequests } from "#components/friend/hooks/use-control-friend-requests.ts";

type t = {
  recipient: string;
  request_id: string
}

export const FriendsSearchingCardActionDeny = ({
  recipient, request_id
}: t) => {
  const { rejectOutgoingRequestMutation } = useControlFriendRequests();

  const handleDeniedFriendReq = () => {
    return rejectOutgoingRequestMutation.mutate({
      recipient, request_id
    });
  };

  return (
    <Button
      onClick={handleDeniedFriendReq}
      variant="pending"
      className="!p-2 rounded-lg"
      disabled={
        rejectOutgoingRequestMutation.isPending ||
        rejectOutgoingRequestMutation.isError
      }
    >
      <RotateCcw size={20} className="text-shark-950" />
    </Button>
  );
};

export const FriendsSearchingCardActionAdd = ({
  recipient, request_id
}: t) => {
  const { createRequestFriendMutation } = useControlFriendRequests();

  const handleAddFriend = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    return createRequestFriendMutation.mutate({ recipient });
  };

  return (
    <Button
      onClick={handleAddFriend}
      variant="positive"
      className="!p-2 rounded-lg"
      disabled={
        createRequestFriendMutation.isPending ||
        createRequestFriendMutation.isError
      }
    >
      <Plus size={20} className="text-shark-950" />
    </Button>
  );
};
