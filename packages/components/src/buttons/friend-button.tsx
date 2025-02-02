import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { useControlFriendRequests } from "#friend/components/friend-card/hooks/use-control-friend-requests.ts";
import { Button } from "@repo/ui/src/components/button.tsx";
import { DropdownWrapper } from "#wrappers/dropdown-wrapper.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Minus, Plus } from "lucide-react";
import { friendStatusQuery } from "./friend-status-query";

export type FriendButtonProps = {
  recipient: string;
};

const IncomingFriendButton = ({
  recipient, request_id,
}: RejectAcceptRequestButton) => {
  const {
    rejectIncomingRequestMutation, acceptIncomingRequestMutation
  } = useControlFriendRequests();

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
            onClick={() => acceptIncomingRequestMutation.mutate({ request_id, recipient })}
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
            onClick={() => rejectIncomingRequestMutation.mutate({ request_id, recipient })}
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

type AddDeleteFriendButton = {
  friend_id: string
  recipient: string
}

type RejectAcceptRequestButton = {
  request_id: string
  recipient: string
}

const DeleteFriendButton = ({
  friend_id, recipient
}: AddDeleteFriendButton) => {
  const { removeFriendMutation } = useControlFriendRequests();

  return (
    <Button
      onClick={() => removeFriendMutation.mutate({ friend_id, recipient })}
      disabled={
        removeFriendMutation.isPending ||
        removeFriendMutation.isError
      }
      variant="negative"
    >
      Удалить из друзей
    </Button>
  );
};

const AddFriendButton = ({
  recipient,
}: Pick<AddDeleteFriendButton, "recipient">) => {
  const { createRequestFriendMutation } = useControlFriendRequests();

  return (
    <Button
      onClick={() => createRequestFriendMutation.mutate({ recipient })}
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

const FriendNotAcceptedButton = () => {
  return (
    <Button state="default" className="flex items-center gap-2">
      <Typography>Не принимает заявки в друзья</Typography>
    </Button>
  )
}

const OutgoingFriendButton = ({
  recipient, request_id
}: RejectAcceptRequestButton) => {
  const { rejectOutgoingRequestMutation } = useControlFriendRequests();

  return (
    <Button
      onClick={() => rejectOutgoingRequestMutation.mutate({ request_id, recipient })}
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

  const currentFriendStatus = friendStatus.status
  const currentFriendId = friendStatus.friend_id
  const currentRequest_id = friendStatus.request_id

  return (
    <>
      {currentFriendStatus === "not-accepted-friend" && (
        <FriendNotAcceptedButton />
      )}
      {(currentFriendStatus === "friend" && currentFriendId) && (
        <DeleteFriendButton friend_id={currentFriendId} recipient={recipient} />
      )}
      {currentFriendStatus === "not-friend" && (
        <AddFriendButton recipient={recipient} />
      )}
      {(currentFriendStatus === "accept-request" && currentRequest_id) && (
        <IncomingFriendButton request_id={currentRequest_id} recipient={recipient} />
      )}
      {(currentFriendStatus === "reject-request" && currentRequest_id) && (
        <OutgoingFriendButton request_id={currentRequest_id} recipient={recipient} />
      )}
    </>
  );
};