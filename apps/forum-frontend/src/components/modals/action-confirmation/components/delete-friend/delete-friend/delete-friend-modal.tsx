import { ConfirmationActionModalTemplate } from "#components/modals/confirmation-modal/components/confirmation-action-modal";
import { ConfirmationButton } from "#components/modals/confirmation-modal/components/confirmation-action-button";
import { Dialog, DialogClose, DialogContent } from "@repo/ui/src/components/dialog.tsx";
import { removeFriendAction, removeFriendIsOpenAtom, removeFriendOptionsAtom } from "#components/friend/models/control-friend-requests.model";
import { FriendWithDetails } from "@repo/types/schemas/friend/friend-types.ts";
import { reatomComponent } from "@reatom/npm-react";

type DeleteFriendModal = Pick<FriendWithDetails, "friend_id" | "nickname">;

export const DeleteFriendModal = reatomComponent(({ ctx }) => {
  const removeFriendOptions = ctx.spy(removeFriendOptionsAtom)
  if (!removeFriendOptions) return null;

  const handleDelete = () => {
    removeFriendAction(ctx, { 
      friend_id: removeFriendOptions.friend_id, recipient: removeFriendOptions.nickname 
    })
  }

  return (
    <Dialog open={ctx.spy(removeFriendIsOpenAtom)} onOpenChange={value => removeFriendIsOpenAtom(ctx, value)}>
      <DialogContent>
        <ConfirmationActionModalTemplate title="Подтверждение действия">
          <ConfirmationButton
            title="Удалить"
            actionType="continue"
            onClick={handleDelete}
            disabled={ctx.spy(removeFriendAction.statusesAtom).isPending}
          />
          <DialogClose>
            <ConfirmationButton
              title="Отмена"
              actionType="cancel"
              disabled={ctx.spy(removeFriendAction.statusesAtom).isPending}
            />
          </DialogClose>
        </ConfirmationActionModalTemplate>
      </DialogContent>
    </Dialog>
  );
}, "DeleteFriendModal")