"use client"

import { DynamicModal } from "../dynamic-modal.tsx";
import { ConfirmationActionModalTemplate } from "#templates/confirmation-action-modal-template.tsx";
import { ConfirmationButton } from "#buttons/confirmation-action-button.tsx";
import { DialogClose } from "@repo/ui/src/components/dialog.tsx";
import { DeleteButton } from "@repo/ui/src/components/detele-button.tsx";
import { TERMINATE_SESSIONS_MUTATION_KEY, useTerminateSession } from "./terminate-all-sessions-modal.tsx";

type TerminateSessionModalProps = {
  session_id: string;
};

export const TerminateSessionModal = ({
  session_id,
}: TerminateSessionModalProps) => {
  const { terminateMutation } = useTerminateSession();
  
  const handleTerminate = () => terminateMutation.mutate({ type: 'single', selectedSessionId: session_id });

  return (
    <DynamicModal
      mutationKey={TERMINATE_SESSIONS_MUTATION_KEY}
      trigger={
        <DeleteButton
          title="Уничтожить сессию"
          disabled={terminateMutation.isPending}
          variant="invisible"
        />
      }
      content={
        <ConfirmationActionModalTemplate title="Уверены, что хотите уничтожить эту сессию?">
          <ConfirmationButton
            actionType="continue"
            title="Да, уничтожить"
            onClick={handleTerminate}
            disabled={terminateMutation.isPending}
          />
          <DialogClose>
            <ConfirmationButton
              actionType="cancel"
              title="Отмена"
              disabled={terminateMutation.isPending}
            />
          </DialogClose>
        </ConfirmationActionModalTemplate>
      }
    />
  );
};
