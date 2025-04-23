import { DropdownMenuItem } from "@repo/ui/src/components/dropdown-menu.tsx";
import { Pin } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { useControlFriend } from "#components/friend/hooks/use-control-friend.ts";
import { FriendCardControlProps } from "#components/friend/components/friend-card-control/components/friend-card-control";

type FriendCardControlPinProps = Pick<FriendCardControlProps, "is_pinned" | "nickname"> & {
  friend_id: string;
};

export const FriendCardControlPin = ({
  is_pinned, nickname: recipient, friend_id
}: FriendCardControlPinProps) => {
  const { setFriendPinnedMutation, setFriendUnpinMutation } =
    useControlFriend();

  const handlePin = () => {
    if (is_pinned) {
      return setFriendUnpinMutation.mutate({ recipient, friend_id });
    } else {
      return setFriendPinnedMutation.mutate({ recipient, friend_id });
    }
  };

  return (
    <DropdownMenuItem
      onClick={handlePin}
      className="flex justify-start items-center gap-2 group"
    >
      <Pin size={16} className="text-shark-300" />
      {is_pinned ? (
        <Typography textSize="medium" className="text-caribbean-green-500">
          Открепить
        </Typography>
      ) : (
        <Typography textSize="medium">Закрепить</Typography>
      )}
    </DropdownMenuItem>
  );
};