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
      variant="positive"
      className="h-10"
      disabled={ctx.spy(controlOutgoingRequestAction.statusesAtom).isPending}
      // @ts-expect-error
      onClick={() => spawn(ctx, async (spawnCtx) => controlOutgoingRequestAction(spawnCtx, { type: "create", recipient }))}
    >
      Добавить в друзья
    </Button>
  );
}, "AddFriendButton")