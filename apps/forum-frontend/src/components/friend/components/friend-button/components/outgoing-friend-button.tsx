import { controlOutgoingRequestAction } from "#components/friend/models/control-friend-requests.model";
import { spawn } from "@reatom/framework";
import { reatomComponent } from "@reatom/npm-react";
import { Button } from "@repo/ui/src/components/button";

type OutgoingRequestButtonProps = {
  request_id: string
  recipient: string;
}

export const OutgoingFriendButton = reatomComponent<OutgoingRequestButtonProps>(({ 
  ctx, recipient, request_id 
}) => {
  return (
    <Button
      onClick={() => spawn(ctx, async (spawnCtx) => controlOutgoingRequestAction(spawnCtx, { type: "reject", request_id, recipient }))}
      variant="pending"
      disabled={ctx.spy(controlOutgoingRequestAction.statusesAtom).isPending}
    >
      Отменить заявку
    </Button>
  );
}, "OutgoingFriendButton")