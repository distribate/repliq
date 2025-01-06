import { SelectedWrapper } from "#wrappers/selected-wrapper.tsx";
import { X } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { useControlFriend } from "#friend/components/friend-card/hooks/use-control-friend.ts";
import { FriendWithDetails } from "@repo/types/schemas/friend/friend-types.ts";

type FriendCardNoteProps = Pick<FriendWithDetails, "friend_id" | "nickname"> & {
  note: string | null;
};

export const FriendCardNote = ({
  note,
  friend_id,
  nickname: recipient,
}: FriendCardNoteProps) => {
  const { setFriendUnNoteMutation } = useControlFriend();

  return (
    <div className="flex items-end gap-2">
      <SelectedWrapper
        className="relative -bottom-1"
        onClick={() =>
          setFriendUnNoteMutation.mutate({
            friend_id,
            recipient,
          })
        }
      >
        <X className="text-red-500" size={16} />
      </SelectedWrapper>
      <Typography className="text-shark-300" textSize="medium">
        {note}
      </Typography>
    </div>
  );
};
