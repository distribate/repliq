import { Button } from "@repo/ui/src/components/button.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { ConfirmationActionModalTemplate } from "#components/modals/confirmation-modal/components/confirmation-action-modal.tsx";
import { ConfirmationButton } from "#components/modals/confirmation-modal/components/confirmation-action-button.tsx";
import {
  removeThreadAction,
} from "#components/thread/thread-control/models/thread-control.model";
import { DialogClose } from "@repo/ui/src/components/dialog.tsx";
import { ThreadPreview } from "@repo/types/entities/thread-type.ts";
import { DynamicModal } from "#components/modals/dynamic-modal/components/dynamic-modal";
import { reatomComponent } from "@reatom/npm-react";

export const ThreadRemoveModal = reatomComponent<Pick<ThreadPreview, "id">>(({ ctx, id }) => {
  return (
    <DynamicModal
      withLoader
      isPending={ctx.spy(removeThreadAction.statusesAtom).isPending}
      trigger={
        <Button variant="negative">
          <Typography>Удалить тред</Typography>
        </Button>
      }
      content={
        <ConfirmationActionModalTemplate title="Уверены, что хотите удалить тред?">
          <ConfirmationButton
            actionType="continue"
            title="Да, удалить"
            disabled={ctx.spy(removeThreadAction.statusesAtom).isPending}
            onClick={() => removeThreadAction(ctx, id)}
          />
          <DialogClose>
            <ConfirmationButton
              actionType="cancel"
              title="Отмена"
              disabled={ctx.spy(removeThreadAction.statusesAtom).isPending}
            />
          </DialogClose>
        </ConfirmationActionModalTemplate>
      }
    />
  );
}, "ThreadRemoveModal")