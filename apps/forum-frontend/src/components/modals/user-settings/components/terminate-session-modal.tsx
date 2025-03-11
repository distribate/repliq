import { DynamicModal } from "../../dynamic-modal.tsx";
import { ConfirmationActionModalTemplate } from "#components/templates/confirmation-action-modal-template.tsx";
import { ConfirmationButton } from "#components/buttons/confirmation-action-button.tsx";
import { DialogClose } from "@repo/ui/src/components/dialog.tsx";
import { DeleteButton } from "@repo/ui/src/components/detele-button.tsx";
import { TERMINATE_SESSIONS_MUTATION_KEY, useTerminateSession } from "./terminate-all-sessions-modal.tsx";

type TerminateSessionModalProps = {
  session_id: string;
};

export const TerminateSessionModal = ({
  session_id,
}: TerminateSessionModalProps) => {
  const { terminateSessionMutation } = useTerminateSession();
  
  return (
    <DynamicModal
      mutationKey={TERMINATE_SESSIONS_MUTATION_KEY}
      trigger={
        <DeleteButton
          title="Уничтожить сессию"
          disabled={terminateSessionMutation.isPending}
          variant="invisible"
        />
      }
      content={
        <ConfirmationActionModalTemplate title="Уверены, что хотите уничтожить эту сессию?">
          <ConfirmationButton
            actionType="continue"
            title="Да, уничтожить"
            onClick={() => terminateSessionMutation.mutate({ type: 'single', selectedSessionId: session_id })}
            disabled={terminateSessionMutation.isPending}
          />
          <DialogClose>
            <ConfirmationButton
              actionType="cancel"
              title="Отмена"
              disabled={terminateSessionMutation.isPending}
            />
          </DialogClose>
        </ConfirmationActionModalTemplate>
      }
    />
  );
};
