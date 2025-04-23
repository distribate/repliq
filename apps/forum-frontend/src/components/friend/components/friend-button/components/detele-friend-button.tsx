import { useControlFriendRequests } from "#components/friend/hooks/use-control-friend-requests";
import { Button } from "@repo/ui/src/components/button";

type FriendButtonProps = {
  recipient: string;
};

export type DeleteFriendButton = FriendButtonProps & {
  friend_id: string
}

export const DeleteFriendButton = ({
  friend_id, recipient
}: DeleteFriendButton) => {
  const { removeFriendMutation } = useControlFriendRequests();

  return (
    <Button
      onClick={() => removeFriendMutation.mutate({ friend_id, recipient })}
      disabled={removeFriendMutation.isPending}
      variant="negative"
    >
      Удалить из друзей
    </Button>
  );
};