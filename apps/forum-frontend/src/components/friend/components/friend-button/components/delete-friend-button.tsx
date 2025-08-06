import { removeFriendAction } from "#components/friend/models/control-friend-requests.model";
import { spawn } from "@reatom/framework";
import { reatomComponent } from "@reatom/npm-react";
import { Button } from "@repo/ui/src/components/button";

type DeleteFriendButton = {
  friend_id: string
  recipient: string;
}

export const DeleteFriendButton = reatomComponent<DeleteFriendButton>(({ ctx, friend_id, recipient }) => {
  const handle = () => {
    spawn(ctx, async (spawnCtx) => removeFriendAction(spawnCtx, { friend_id, recipient }))
  };
  
  return (
    <Button
      onClick={handle}
      disabled={ctx.spy(removeFriendAction.statusesAtom).isPending}
      variant="negative"
    >
      Удалить из друзей
    </Button>
  );
}, "DeleteFriendButton")