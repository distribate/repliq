import { useControlFriendRequests } from "#components/friend/hooks/use-control-friend-requests";
import { Button } from "@repo/ui/src/components/button";

type FriendButtonProps = {
  recipient: string;
};

export type OutgoingRequestButtonProps = FriendButtonProps & {
  request_id: string
}

export const OutgoingFriendButton = ({
  recipient, request_id
}: OutgoingRequestButtonProps) => {
  const { rejectOutgoingRequestMutation } = useControlFriendRequests();

  return (
    <Button
      onClick={() => rejectOutgoingRequestMutation.mutate({ request_id, recipient })}
      variant="pending"
      disabled={rejectOutgoingRequestMutation.isPending}
    >
      Отменить заявку
    </Button>
  );
};
