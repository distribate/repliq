import { Button } from "@repo/ui/src/components/button.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { ConfirmationActionModalTemplate } from "#components/modals/confirmation-modal/components/confirmation-action-modal.tsx";
import { ConfirmationButton } from "#components/modals/confirmation-modal/components/confirmation-action-button.tsx";
import {
  THREAD_CONTROL_MUTATION_KEY,
  useThreadControl,
} from "#components/thread/thread-control/hooks/use-thread-control";
import { DialogClose } from "@repo/ui/src/components/dialog.tsx";
import { ThreadPreview } from "@repo/types/entities/thread-type.ts";
import { DynamicModal } from "#components/modals/dynamic-modal/components/dynamic-modal";

export const ThreadRemoveModal = ({ id }: Pick<ThreadPreview, "id">) => {
  const { removeThreadMutation } = useThreadControl();

  return (
    <DynamicModal
      mutationKey={THREAD_CONTROL_MUTATION_KEY}
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
            disabled={removeThreadMutation.isPending}
            onClick={() => removeThreadMutation.mutate(id)}
          />
          <DialogClose>
            <ConfirmationButton
              actionType="cancel"
              title="Отмена"
              disabled={removeThreadMutation.isPending}
            />
          </DialogClose>
        </ConfirmationActionModalTemplate>
      }
    />
  );
};