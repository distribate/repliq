import { DynamicModal } from "../dynamic-modal.tsx";
import { ConfirmationActionModalTemplate } from "#templates/confirmation-action-modal-template.tsx";
import { ConfirmationButton } from "#buttons/confirmation-action-button.tsx";
// import {
//   TERMINATE_SESSIONS_MUTATION_KEY, useTerminateSession,
// } from '../action-confirmation/components/terminate-session/hooks/use-terminate-session.ts';
import { DialogClose } from "@repo/ui/src/components/dialog.tsx";
import { DeleteButton } from "@repo/ui/src/components/detele-button.tsx";

type TerminateSessionModalProps = {
  session_uuid: string;
};

export const TerminateSessionModal = ({
  session_uuid,
}: TerminateSessionModalProps) => {
  // if (!session_uuid) return null;
  //
  // const { terminateMutation } = useTerminateSession();
  //
  // const handleTerminate = () => {
  //   return terminateMutation.mutate({ type: 'single', session_uuid });
  // };

  return (
    <div></div>
    // <DynamicModal
    //   mutationKey={TERMINATE_SESSIONS_MUTATION_KEY}
    //   trigger={
    //     <DeleteButton
    //       title="Удалить изображение"
    //       disabled={terminateMutation.isPending}
    //       variant="invisible"
    //     />
    //   }
    //   content={
    //     <ConfirmationActionModalTemplate title="Уверены, что хотите уничтожить эту сессию?">
    //       <ConfirmationButton
    //         actionType="continue"
    //         title="Да, уничтожить"
    //         onClick={handleTerminate}
    //         disabled={terminateMutation.isPending}
    //       />
    //       <DialogClose>
    //         <ConfirmationButton
    //           actionType="cancel"
    //           title="Отмена"
    //           disabled={terminateMutation.isPending}
    //         />
    //       </DialogClose>
    //     </ConfirmationActionModalTemplate>
    //   }
    // />
  );
};
