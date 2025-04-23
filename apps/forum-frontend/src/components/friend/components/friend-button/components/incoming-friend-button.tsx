import { useControlFriendRequests } from "#components/friend/hooks/use-control-friend-requests";
import { Button } from "@repo/ui/src/components/button";
import { Typography } from "@repo/ui/src/components/typography";
import { DropdownWrapper } from "#components/wrappers/components/dropdown-wrapper";
import { Minus, Plus } from "lucide-react";

type FriendButtonProps = {
  recipient: string;
};

export type IncomingFriendButtonProps = FriendButtonProps & {
  request_id: string
}

export const IncomingFriendButton = ({
  recipient, request_id,
}: IncomingFriendButtonProps) => {
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