import { SelectedWrapper } from "#components/wrappers/components/selected-wrapper";
import { X } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { setFriendUnnoteAction } from "#components/friend/models/control-friend.model";
import { FriendWithDetails } from "@repo/types/schemas/friend/friend-types.ts";
import { reatomComponent } from "@reatom/npm-react";

type FriendCardNoteProps = Pick<FriendWithDetails, "friend_id" | "nickname"> & {
  note: string | null;
};

export const FriendNote = reatomComponent<FriendCardNoteProps>(({
  ctx, note, friend_id, nickname: recipient,
}) => {
  return (
    <div className="flex items-center gap-2">
      <SelectedWrapper
        className="relative -bottom-1"
        onClick={() => setFriendUnnoteAction(ctx, { friend_id, recipient })}
      >
        <X className="text-red-500" size={16} />
      </SelectedWrapper>
      <Typography className="text-shark-300" textSize="medium">
        {note}
      </Typography>
    </div>
  );
}, "FriendCardNote")