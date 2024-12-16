"use client";

import {
  checkFriendRequestStatus,
  RequestStatus,
} from "@repo/lib/helpers/check-friend-request-status.ts";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { useEffect, useState } from "react";
import { useControlFriendRequests } from "#friend/components/friend-card/hooks/use-control-friend-requests.ts";
import { Button } from "@repo/ui/src/components/button.tsx";
import { FriendRequestProperties } from "#friend/components/friend-card/types/friend-request-types.ts";
import { DropdownWrapper } from "#wrappers/dropdown-wrapper.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Minus, Plus } from "lucide-react";

export type FriendButtonProps = {
  reqUserNickname: string;
};

const IncomingFriendButton = ({
  initiator,
}: Pick<FriendRequestProperties, "initiator">) => {
  const {
     rejectIncomingRequestMutation, acceptIncomingRequestMutation
  } = useControlFriendRequests();

  const handleAcceptRequest = () => acceptIncomingRequestMutation.mutate(initiator);

  const handleRejectRequest = () => rejectIncomingRequestMutation.mutate(initiator);

  return (
    <DropdownWrapper
      properties={{ sideAlign: "right", contentAlign: "start" }}
      trigger={
        <Button variant="pending">
          <Typography>Хочет добавить вас в друзья</Typography>
        </Button>
      }
      content={
        <div className="flex flex-col gap-y-1 *:w-full w-full">
          <Button
            onClick={handleAcceptRequest}
            className="flex justify-start items-center bg-shark-800 gap-2 group"
            disabled={
              acceptIncomingRequestMutation.isPending ||
              acceptIncomingRequestMutation.isError
            }
          >
            <Plus size={16} className="text-shark-300" />
            <Typography>Принять заявку</Typography>
          </Button>
          <Button
            onClick={handleRejectRequest}
            className="flex justify-start items-center bg-shark-800 gap-2 group"
            disabled={
              rejectIncomingRequestMutation.isPending ||
              rejectIncomingRequestMutation.isError
            }
          >
            <Minus size={16} className="text-shark-300" />
            <Typography>Отклонить заявку</Typography>
          </Button>
        </div>
      }
    />
  );
};

const DeleteFriendButton = ({
  recipient: reqUserNickname,
}: Pick<FriendRequestProperties, "recipient">) => {
  const { removeFriendMutation } = useControlFriendRequests();

  const handleDeleteFriend = () => removeFriendMutation.mutate({ reqUserNickname });

  return (
    <Button
      onClick={handleDeleteFriend}
      disabled={removeFriendMutation.isPending || removeFriendMutation.isError}
      variant="negative"
    >
      Удалить из друзей
    </Button>
  );
};

const AddFriendButton = ({
  recipient,
}: Pick<FriendRequestProperties, "recipient">) => {
  const { createRequestFriendMutation } = useControlFriendRequests();

  const handleAddFriend = () => createRequestFriendMutation.mutate(recipient);

  return (
    <Button
      onClick={handleAddFriend}
      variant="positive"
      disabled={
        createRequestFriendMutation.isPending ||
        createRequestFriendMutation.isError
      }
    >
      Добавить в друзья
    </Button>
  );
};

const OutgoingFriendButton = ({
  recipient,
}: Pick<FriendRequestProperties, "recipient">) => {
  const { rejectOutgoingRequestMutation } = useControlFriendRequests();

  const handleDeniedFriendReq = () => rejectOutgoingRequestMutation.mutate(recipient);

  return (
    <Button
      onClick={handleDeniedFriendReq}
      variant="pending"
      disabled={
        rejectOutgoingRequestMutation.isPending ||
        rejectOutgoingRequestMutation.isError
      }
    >
      Отменить заявку
    </Button>
  );
};


export const FriendButton = ({ reqUserNickname }: FriendButtonProps) => {
  const [currentRequestStatus, setCurrentRequestStatus] =
    useState<RequestStatus | null>(null);
  const currentUser = getUser();
  if (!currentUser) return null;

  const reqStatus = checkFriendRequestStatus(reqUserNickname);

  useEffect(() => {
    setCurrentRequestStatus(reqStatus);
  }, [reqStatus]);

  if (!currentRequestStatus) return <Skeleton className="h-10 border border-white/10 rounded-md w-56" />;

  return (
    <>
      {currentRequestStatus === "friend" && (
        <DeleteFriendButton recipient={reqUserNickname} />
      )}
      {currentRequestStatus === "default" && (
        <AddFriendButton recipient={reqUserNickname} />
      )}
      {currentRequestStatus === "accept" && (
        <IncomingFriendButton initiator={reqUserNickname} />
      )}
      {currentRequestStatus === "deny" && (
        <OutgoingFriendButton recipient={reqUserNickname} />
      )}
    </>
  );
};