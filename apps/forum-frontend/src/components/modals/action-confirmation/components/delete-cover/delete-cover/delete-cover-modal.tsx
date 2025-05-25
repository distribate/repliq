import { X } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { ConfirmationButton } from "#components/modals/confirmation-modal/components/confirmation-action-button.tsx";
import { ConfirmationActionModalTemplate } from "#components/modals/confirmation-modal/components/confirmation-action-modal.tsx";
import { DialogClose } from "@repo/ui/src/components/dialog.tsx";
import { DynamicModal } from "../../../../dynamic-modal/components/dynamic-modal.tsx";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { reatomComponent } from "@reatom/npm-react";
import { deleteBackgroundImageAction } from "#components/profile/header/models/cover-image.model.ts";

export const DeleteCoverModal = reatomComponent(({ ctx }) => {
  const cover_image = getUser(ctx).cover_image;
  if (!cover_image) return null;

  return (
    <DynamicModal
      isPending={ctx.spy(deleteBackgroundImageAction.statusesAtom).isPending}
      withLoader
      trigger={
        <div className="flex hover:bg-shark-600 rounded-md p-2 gap-2 items-center group">
          <X size={20} className="text-shark-300 group-hover:text-pink-500" />
          <Typography>Удалить фон</Typography>
        </div>
      }
      content={
        <ConfirmationActionModalTemplate title="Подтверждение действия">
          <ConfirmationButton
            title="Удалить"
            actionType="continue"
            onClick={() => deleteBackgroundImageAction(ctx)}
            disabled={ctx.spy(deleteBackgroundImageAction.statusesAtom).isPending}
            pending={ctx.spy(deleteBackgroundImageAction.statusesAtom).isPending}
          />
          <DialogClose>
            <ConfirmationButton
              title="Отмена"
              actionType="cancel"
              disabled={ctx.spy(deleteBackgroundImageAction.statusesAtom).isPending}
            />
          </DialogClose>
        </ConfirmationActionModalTemplate>
      }
    />
  );
}, "DeleteCoverModal")