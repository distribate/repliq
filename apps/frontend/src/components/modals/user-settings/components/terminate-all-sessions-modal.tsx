import { Typography } from "@repo/ui/src/components/typography.tsx";
import { HoverCardItem } from "@repo/ui/src/components/hover-card.tsx";
import { ConfirmationActionModalTemplate } from "#components/modals/confirmation-modal/components/confirmation-action-modal.tsx";
import { ConfirmationButton } from "#components/modals/confirmation-modal/components/confirmation-action-button.tsx";
import { DynamicModal } from "../../dynamic-modal/components/dynamic-modal.tsx";
import { DialogClose } from "@repo/ui/src/components/dialog.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { terminateSessionAction } from "../models/terminate-sessions.model.ts";
import { IconX } from "@tabler/icons-react";

export const TerminateAllSessionsModal = reatomComponent(({ ctx }) => {
  return (
    <DynamicModal
      autoClose
      withLoader
      isPending={ctx.spy(terminateSessionAction.statusesAtom).isPending}
      trigger={
        <HoverCardItem className="gap-2 px-2 text-red-500">
          <IconX size={32} />
          <Typography className="text-base">
            Выйти с остальных сессий
          </Typography>
        </HoverCardItem>
      }
      content={
        <ConfirmationActionModalTemplate title="Уверены, что хотите уничтожить все остальные сессии?">
          <ConfirmationButton
            actionType="continue"
            title="Да, уничтожить"
            onClick={() => terminateSessionAction(ctx, { type: 'all' })}
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
}, "TerminateAllSessionsModal")