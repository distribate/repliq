import { Typography } from "@repo/ui/src/components/typography.tsx";
import { ThreadControlTitle } from "./thread-control-title.tsx";
import { ThreadControlDescription } from "./thread-control-description.tsx";
import { ThreadControlComments } from "./thread-control-comments.tsx";
import { ThreadControlSave } from "#components/thread/thread-control/components/thread-control-save.tsx";
import { threadAtom } from "#components/thread/thread-main/models/thread.model.ts";
import { useAtom } from "@reatom/npm-react";
import { Button } from "@repo/ui/src/components/button.tsx";
import { ConfirmationActionModalTemplate } from "#components/modals/confirmation-modal/components/confirmation-action-modal.tsx";
import { ConfirmationButton } from "#components/modals/confirmation-modal/components/confirmation-action-button.tsx";
import {
  removeThreadAction,
} from "#components/thread/thread-control/models/thread-control.model";
import { DialogClose } from "@repo/ui/src/components/dialog.tsx";
import { ThreadPreview } from "@repo/types/entities/thread-type.ts";
import { DynamicModal } from "#components/modals/dynamic-modal/components/dynamic-modal";
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

type ThreadControlMainProps = {
  threadId: string;
};

export const ThreadControlMain = ({
  threadId
}: ThreadControlMainProps) => {
  const [currentThread] = useAtom(threadAtom)

  if (!currentThread) return null;

  return (
    <div className="flex flex-col gap-y-4 px-4 w-full">
      <Typography variant="dialogTitle">
        {currentThread.title}&nbsp;
        <span className="text-shark-400 text-sm">ред.</span>
      </Typography>
      <div className="flex flex-col gap-y-4 justify-between">
        <ThreadControlTitle title={currentThread.title} />
        <ThreadControlDescription description={currentThread.description} />
        <ThreadControlComments is_comments={currentThread.properties.is_comments} />
        <div className="flex items-center gap-2 justify-end w-full">
          <ThreadControlSave threadId={threadId} />
          <ThreadRemoveModal id={currentThread.id} />
        </div>
      </div>
    </div>
  );
};
