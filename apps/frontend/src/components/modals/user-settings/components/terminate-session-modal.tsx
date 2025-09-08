import { DynamicModal } from "../../../../shared/components/dynamic-modal.tsx";
import { ConfirmationActionModalTemplate } from "#shared/components/confirmation-action-modal.tsx";
import { ConfirmationButton } from "#shared/components/confirmation-action-button.tsx";
import { DialogClose } from "@repo/ui/src/components/dialog.tsx";
import { DeleteButton } from "@repo/ui/src/components/detele-button.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { terminateSessionAction } from "../models/terminate-sessions.model.ts";

type TerminateSessionModalProps = {
  session_id: string;
};

export const TerminateSessionModal = reatomComponent<TerminateSessionModalProps>(({ 
  ctx, session_id,
}) => {
  return (
    <DynamicModal
      autoClose
      withLoader
      isPending={ctx.spy(terminateSessionAction.statusesAtom).isPending}
      trigger={
        <DeleteButton
          title="Уничтожить сессию"
          disabled={ctx.spy(terminateSessionAction.statusesAtom).isPending}
          variant="invisible"
        />
      }
      content={
        <ConfirmationActionModalTemplate title="Уверены, что хотите уничтожить эту сессию?">
          <ConfirmationButton
            actionType="continue"
            title="Да, уничтожить"
            onClick={() => terminateSessionAction(ctx, { type: 'single', selectedSessionId: session_id })}
            disabled={ctx.spy(terminateSessionAction.statusesAtom).isPending}
          />
          <DialogClose>
            <ConfirmationButton
              actionType="cancel"
              title="Отмена"
              disabled={ctx.spy(terminateSessionAction.statusesAtom).isPending}
            />
          </DialogClose>
        </ConfirmationActionModalTemplate>
      }
    />
  );
}, "TerminateSessionModal")