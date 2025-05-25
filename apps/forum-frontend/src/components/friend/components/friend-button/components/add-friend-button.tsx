import { controlOutgoingRequestAction } from "#components/friend/models/control-friend-requests.model";
import { spawn } from "@reatom/framework";
import { reatomComponent } from "@reatom/npm-react";
import { Button } from "@repo/ui/src/components/button";

type AddFriendButtonProps = {
  recipient: string;
}

export const AddFriendButton = reatomComponent<AddFriendButtonProps>(({ ctx, recipient }) => {
  return (
    <Button
      // @ts-ignore
      onClick={() => spawn(ctx, async (spawnCtx) => controlOutgoingRequestAction(spawnCtx, { type: "create", recipient }))}
      variant="positive"
      disabled={ctx.spy(controlOutgoingRequestAction.statusesAtom).isPending}
    >
      Добавить в друзья
    </Button>
  );
}, "AddFriendButton")