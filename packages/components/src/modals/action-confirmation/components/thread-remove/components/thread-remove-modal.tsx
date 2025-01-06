import { Button } from "@repo/ui/src/components/button.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { ConfirmationActionModalTemplate } from "#templates/confirmation-action-modal-template.tsx";
import { ConfirmationButton } from "#buttons/confirmation-action-button.tsx";
import { DynamicModal } from "../../../../dynamic-modal.tsx";
import {
  THREAD_CONTROL_MUTATION_KEY,
  useThreadControl,
} from "#thread/components/thread-control/hooks/use-thread-control.ts";
import { DialogClose } from "@repo/ui/src/components/dialog.tsx";
import { ThreadPreview } from "@repo/types/entities/thread-type.ts";

export const ThreadRemoveModal = ({ id }: Pick<ThreadPreview, "id">) => {
  const { removeThreadMutation } = useThreadControl();

  const handleRemoveThread = () => {
    return removeThreadMutation.mutate(id);
  };

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
            onClick={handleRemoveThread}
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
