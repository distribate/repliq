import { controlIncomingRequestAction } from "#components/friend/models/control-friend-requests.model";
import { Button } from "@repo/ui/src/components/button";
import { Typography } from "@repo/ui/src/components/typography";
import { Minus, Plus } from "lucide-react";
import { reatomComponent } from "@reatom/npm-react";
import { spawn } from "@reatom/framework";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu";

type IncomingFriendButtonProps = {
  request_id: string
  recipient: string;
}

export const IncomingFriendButton = reatomComponent<IncomingFriendButtonProps>(({ ctx, recipient, request_id, }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="pending">
          <Typography>Хочет добавить вас в друзья</Typography>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start">
        <div className="flex flex-col gap-y-1 *:w-full w-full">
          <Button
            onClick={() => {
              spawn(ctx, async (spawnCtx) => controlIncomingRequestAction(spawnCtx, { type: "accept", request_id, recipient }))
            }}
            className="flex justify-start items-center bg-shark-800 gap-2 group"
            disabled={ctx.spy(controlIncomingRequestAction.statusesAtom).isPending}
          >
            <Plus size={16} className="text-shark-300" />
            <Typography>Принять заявку</Typography>
          </Button>
          <Button
            onClick={() => {
              spawn(ctx, async (spawnCtx) => controlIncomingRequestAction(spawnCtx, { type: "reject", request_id, recipient }))
            }}
            className="flex justify-start items-center bg-shark-800 gap-2 group"
            disabled={ctx.spy(controlIncomingRequestAction.statusesAtom).isPending}
          >
            <Minus size={16} className="text-shark-300" />
            <Typography>Отклонить заявку</Typography>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}, "IncomingFriendButton")