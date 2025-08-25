import { Button } from "@repo/ui/src/components/button.tsx";
import { RotateCcw } from "lucide-react";
import { controlOutgoingRequestAction } from "#components/friend/models/control-friend-requests.model";
import { reatomComponent } from "@reatom/npm-react";
import { IconPlus } from "@tabler/icons-react";

type Props = {
  recipient: string;
  request_id: string
}

export const FriendsSearchingCardActionDeny = reatomComponent<Props>(({ ctx, recipient, request_id }) => {
  const handle = () => {
    controlOutgoingRequestAction(ctx, { type: "reject", recipient, request_id });
  };

  const isDisabled = ctx.spy(controlOutgoingRequestAction.statusesAtom).isPending ||
    ctx.spy(controlOutgoingRequestAction.statusesAtom).isRejected

  return (
    <Button
      onClick={handle}
      variant="pending"
      className="!p-2 rounded-lg"
      disabled={isDisabled}
    >
      <RotateCcw size={20} className="text-shark-950" />
    </Button>
  );
}, "FriendsSearchingCardActionDeny")

export const FriendsSearchingCardActionAdd = reatomComponent<Props>(({ ctx, recipient, request_id }) => {
  const handle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    controlOutgoingRequestAction(ctx, { type: "create", recipient, request_id });
  };

  const isDisabled = ctx.spy(controlOutgoingRequestAction.statusesAtom).isPending ||
    ctx.spy(controlOutgoingRequestAction.statusesAtom).isRejected

  return (
    <Button
      onClick={handle}
      variant="positive"
      className="!p-2 rounded-lg"
      disabled={isDisabled}
    >
      <IconPlus size={20} className="text-shark-950" />
    </Button>
  );
}, "FriendsSearchingCardActionAdd")