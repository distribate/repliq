import { useControlFriendRequests } from "#components/friend/hooks/use-control-friend-requests";
import { Button } from "@repo/ui/src/components/button";

type FriendButtonProps = {
  recipient: string;
};

export type AddFriendButtonProps = FriendButtonProps & {
  friend_id: string
}

export const AddFriendButton = ({
  recipient,
}: Pick<AddFriendButtonProps, "recipient">) => {
  const { createRequestFriendMutation } = useControlFriendRequests();

  return (
    <Button
      onClick={() => createRequestFriendMutation.mutate({ recipient })}
      variant="positive"
      disabled={createRequestFriendMutation.isPending}
    >
      Добавить в друзья
    </Button>
  );
};