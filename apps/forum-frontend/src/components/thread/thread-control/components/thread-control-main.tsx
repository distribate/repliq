import { Typography } from "@repo/ui/src/components/typography.tsx";
import { ThreadControlTitle } from "./thread-control-title.tsx";
import { ThreadControlDescription } from "./thread-control-description.tsx";
import { ThreadControlComments } from "./thread-control-comments.tsx";
import { ThreadControlSave } from "#components/thread/thread-control/components/thread-control-save.tsx";
import { threadAtom } from "#components/thread/thread-main/models/thread.model.ts";
import { ThreadRemoveModal } from "#components/modals/action-confirmation/components/thread-remove/thread-remove/thread-remove-modal.tsx";
import { useAtom } from "@reatom/npm-react";

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
