import { Typography } from "@repo/ui/src/components/typography.tsx";
import { ThreadRemoveModal } from "#components/modals/action-confirmation/components/thread-remove/thread-remove-modal.tsx";
import { ThreadControlTitle } from "./thread-control-title.tsx";
import { ThreadControlDescription } from "./thread-control-description.tsx";
import { ThreadControlComments } from "./thread-control-comments.tsx";
import { ThreadControlSave } from "#components/thread/components/thread-control/components/thread-control-save.tsx";
import { THREAD_QUERY_KEY } from "#components/thread/components/thread-main/queries/thread-query.ts";
import { useQueryClient } from "@tanstack/react-query";
import { ThreadDetailed } from "@repo/types/entities/thread-type.ts";

type ThreadControlMainProps = {
  threadId: string;
};

export const ThreadControlMain = ({
  threadId
}: ThreadControlMainProps) => {
  const qc = useQueryClient()
  const currentThread = qc.getQueryData<ThreadDetailed>(THREAD_QUERY_KEY(threadId));

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
