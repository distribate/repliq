import { Button } from "@repo/ui/src/components/button.tsx";
import { Plus, RotateCcw } from "lucide-react";
import { controlOutgoingRequestAction } from "#components/friend/models/control-friend-requests.model";
import { reatomComponent } from "@reatom/npm-react";

type t = {
  recipient: string;
  request_id: string
}

export const FriendsSearchingCardActionDeny = reatomComponent<t>(({ ctx, recipient, request_id }) => {
  const handleDeniedFriendReq = () => {
    controlOutgoingRequestAction(ctx, { type: "reject", recipient, request_id });
  };

  return (
    <Button
      onClick={handleDeniedFriendReq}
      variant="pending"
      className="!p-2 rounded-lg"
      disabled={
        ctx.spy(controlOutgoingRequestAction.statusesAtom).isPending ||
        ctx.spy(controlOutgoingRequestAction.statusesAtom).isRejected
      }
    >
      <RotateCcw size={20} className="text-shark-950" />
    </Button>
  );
}, "FriendsSearchingCardActionDeny")

export const FriendsSearchingCardActionAdd = reatomComponent<t>(({ ctx, recipient, request_id }) => {
  const handleAddFriend = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    return controlOutgoingRequestAction(ctx, { type: "create", recipient, request_id });
  };

  return (
    <Button
      onClick={handleAddFriend}
      variant="positive"
      className="!p-2 rounded-lg"
      disabled={
        ctx.spy(controlOutgoingRequestAction.statusesAtom).isPending ||
        ctx.spy(controlOutgoingRequestAction.statusesAtom).isRejected
      }
    >
      <Plus size={20} className="text-shark-950" />
    </Button>
  );
}, "FriendsSearchingCardActionAdd")