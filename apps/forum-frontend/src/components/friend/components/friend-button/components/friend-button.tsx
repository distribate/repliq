import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { currentUserNicknameAtom } from "#components/user/models/current-user.model.ts";
import { Button } from "@repo/ui/src/components/button.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { friendStatusAction, getFriendStatusesAtom } from "../models/friend-status.model";
import { DeleteFriendButton } from "./delete-friend-button";
import { FriendNotAcceptedButton } from "./not-accepted-friend-button";
import { AddFriendButton } from "./add-friend-button";
import { IncomingFriendButton } from "./incoming-friend-button";
import { OutgoingFriendButton } from "./outgoing-friend-button";
import { ReactNode } from "react";
import { reatomComponent, useUpdate } from "@reatom/npm-react";

type FriendButtonProps = {
  recipient: string;
};

const BUTTONS = ({
  recipient, friend_id, request_id
}: FriendButtonProps & { friend_id: string, request_id: string }): Record<
  "friend" | "not-accepted-friend" | "not-friend" | "reject-request" | "accept-request", ReactNode
> => ({
  "friend": <DeleteFriendButton friend_id={friend_id} recipient={recipient} />,
  "not-accepted-friend": <FriendNotAcceptedButton />,
  "not-friend": <AddFriendButton recipient={recipient} />,
  "accept-request": <IncomingFriendButton request_id={request_id} recipient={recipient} />,
  "reject-request": <OutgoingFriendButton request_id={request_id} recipient={recipient} />
})

const SyncRecipient = ({ recipient }: FriendButtonProps) => {
  useUpdate((ctx) => friendStatusAction(ctx, recipient), [recipient])
  return null;
}

const FriendButtonInside = reatomComponent<FriendButtonProps>(({ ctx, recipient }) => {
  const friendStatus = getFriendStatusesAtom(ctx, recipient)

  if (ctx.spy(friendStatusAction.statusesAtom).isPending) {
    return <Skeleton className="h-10 border border-white/10 rounded-md w-56" />
  }

  if (!friendStatus) return null;

  return BUTTONS({ friend_id: friendStatus.friend_id!, request_id: friendStatus.request_id!, recipient })[friendStatus.status]
}, "FriendButton")

const FriendButtonSelf = () => {
  return (
    <Button state="default" className="px-6">
      <Typography>Это вы</Typography>
    </Button>
  )
}

export const FriendButton = reatomComponent<FriendButtonProps>(({ ctx, recipient }) => {
  const initiator = ctx.spy(currentUserNicknameAtom)
  if (!initiator) return null;

  if (initiator === recipient) return <FriendButtonSelf />

  return (
    <>
      <SyncRecipient recipient={recipient} />
      <FriendButtonInside recipient={recipient} />
    </>
  )
}, "FriendButton")