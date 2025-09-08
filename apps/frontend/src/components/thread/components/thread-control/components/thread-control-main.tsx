import { Typography } from "@repo/ui/src/components/typography.tsx";
import { ThreadControlTitle } from "./thread-control-title.tsx";
import { ThreadControlDescription } from "./thread-control-description.tsx";
import { ThreadControlComments } from "./thread-control-comments.tsx";
import { ThreadControlSave } from "#components/thread/components/thread-control/components/thread-control-save.tsx";
import { threadAtom, threadPropertiesAtom } from "#components/thread/models/thread.model.ts";
import { Button } from "@repo/ui/src/components/button.tsx";
import { ConfirmationActionModalTemplate } from "#shared/components/confirmation-action-modal.tsx";
import { ConfirmationButton } from "#shared/components/confirmation-action-button.tsx";
import {
  removeThreadAction,
} from "#components/thread/components/thread-control/models/thread-control.model.ts";
import { DialogClose } from "@repo/ui/src/components/dialog.tsx";
import { ThreadPreview } from "@repo/types/entities/thread-type.ts";
import { DynamicModal } from "#shared/components/dynamic-modal.tsx";
import { reatomComponent } from "@reatom/npm-react";

const ThreadRemoveModal = reatomComponent<Pick<ThreadPreview, "id">>(({ ctx, id }) => {
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

export const ThreadControlMain = reatomComponent(({ 
  ctx
}) => {
  const thread = ctx.spy(threadAtom)
  const properties = ctx.spy(threadPropertiesAtom)

  if (!thread || !properties) return null;

  return (
    <div className="flex flex-col gap-y-4 px-4 w-full">
      <Typography variant="dialogTitle">
        {thread.title}&nbsp;
        <span className="text-shark-400 text-sm">ред.</span>
      </Typography>
      <div className="flex flex-col gap-y-4 justify-between">
        <ThreadControlTitle title={thread.title} />
        <ThreadControlDescription description={thread.description} />
        <ThreadControlComments is_comments={properties.is_comments} />
        <div className="flex items-center gap-2 justify-end w-full">
          <ThreadControlSave threadId={thread.id} />
          <ThreadRemoveModal id={thread.id} />
        </div>
      </div>
    </div>
  );
}, "ThreadControlMain")