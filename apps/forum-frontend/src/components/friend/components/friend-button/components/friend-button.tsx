import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { Button } from "@repo/ui/src/components/button.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { friendStatusQuery } from "../queries/friend-status-query";
import { DeleteFriendButton } from "./detele-friend-button";
import { FriendNotAcceptedButton } from "./not-accepted-friend-button";
import { AddFriendButtonProps, AddFriendButton } from "./add-friend-button";
import { IncomingFriendButton } from "./incoming-friend-button";
import { OutgoingFriendButton, OutgoingRequestButtonProps } from "./outgoin-friend-button";
import { ReactNode } from "@tanstack/react-router";

type FriendButtonProps = {
  recipient: string;
};

const BUTTONS = ({
  recipient, friend_id, request_id
}: OutgoingRequestButtonProps & AddFriendButtonProps): Record<
  "friend" | "not-accepted-friend" | "not-friend" | "reject-request" | "accept-request", ReactNode
> => ({
  "friend": <DeleteFriendButton friend_id={friend_id} recipient={recipient} />,
  "not-accepted-friend": <FriendNotAcceptedButton />,
  "not-friend": <AddFriendButton recipient={recipient} />,
  "accept-request": <IncomingFriendButton request_id={request_id} recipient={recipient} />,
  "reject-request": <OutgoingFriendButton request_id={request_id} recipient={recipient} />
})

export const FriendButton = ({
  recipient
}: FriendButtonProps) => {
  const { nickname: initiator } = getUser();
  const { data: friendStatus, isLoading } = friendStatusQuery(initiator, recipient)

  if (initiator === recipient) {
    return (
      <Button state="default" className="px-6">
        <Typography>Это вы</Typography>
      </Button>
    )
  }

  if (isLoading) {
    return <Skeleton className="h-10 border border-white/10 rounded-md w-56" />
  }

  if (!friendStatus) return null;

  return BUTTONS({ 
    friend_id: friendStatus.friend_id!, 
    request_id: friendStatus.request_id!,
    recipient 
  })[friendStatus.status]
};