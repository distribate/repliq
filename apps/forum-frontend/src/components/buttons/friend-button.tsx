import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { useControlFriendRequests } from "#components/friend/hooks/use-control-friend-requests.ts";
import { Button } from "@repo/ui/src/components/button.tsx";
import { DropdownWrapper } from "#components/wrappers/dropdown-wrapper.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Minus, Plus } from "lucide-react";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder";
import { forumUserClient } from "@repo/shared/api/forum-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ReactNode } from "react";

type FriendButtonProps = {
  recipient: string;
};

type AddDeleteFriendButton = FriendButtonProps & {
  friend_id: string
}

type RejectAcceptRequestButton = FriendButtonProps & {
  request_id: string
}

export const FRIEND_STATUS_QUERY_KEY = (recipient: string) => 
  createQueryKey("user", ["friend-status", recipient])

const getUserFriendStatus = async (recipient: string) => {
  const res = await forumUserClient.user["get-friend-status"][":nickname"].$get({
    param: { nickname: recipient }
  })

  const data = await res.json();

  if (!data || "error" in data) {
    return null;
  }

  return data.data
}

export const friendStatusOpts = (initiator: string, recipient: string) => {
  return {
    queryKey: FRIEND_STATUS_QUERY_KEY(recipient),
    queryFn: async () => {
      if (initiator === recipient) return null;

      return getUserFriendStatus(recipient)
    },
    refetchOnWindowFocus: false
  }
}

export const friendStatusQuery = (initiator: string, recipient: string) => useSuspenseQuery({
  ...friendStatusOpts(initiator, recipient)
})

const IncomingFriendButton = ({
  recipient, request_id,
}: RejectAcceptRequestButton) => {
  const { rejectIncomingRequestMutation, acceptIncomingRequestMutation } = useControlFriendRequests();

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
            disabled={acceptIncomingRequestMutation.isPending}
          >
            <Plus size={16} className="text-shark-300" />
            <Typography>Принять заявку</Typography>
          </Button>
          <Button
            onClick={() => rejectIncomingRequestMutation.mutate({ request_id, recipient })}
            className="flex justify-start items-center bg-shark-800 gap-2 group"
            disabled={rejectIncomingRequestMutation.isPending}
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
  friend_id, recipient
}: AddDeleteFriendButton) => {
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

const AddFriendButton = ({
  recipient,
}: Pick<AddDeleteFriendButton, "recipient">) => {
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
      disabled={rejectOutgoingRequestMutation.isPending}
    >
      Отменить заявку
    </Button>
  );
};

const BUTTONS = ({
  recipient, friend_id, request_id
}: RejectAcceptRequestButton & AddDeleteFriendButton): Record<
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

  if (isLoading) return <Skeleton className="h-10 border border-white/10 rounded-md w-56" />

  if (!friendStatus) return null;

  return BUTTONS({ friend_id: friendStatus.friend_id!, request_id: friendStatus.request_id!, recipient })[friendStatus.status]
};