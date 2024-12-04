"use client";

import { Typography } from "@repo/ui/src/components/typography.tsx";
import { currentThreadQuery } from "../queries/current-thread-query.ts";
import { ThreadRemoveModal } from "#modals/action-confirmation/components/thread-remove/components/thread-remove-modal.tsx";
import { ThreadControlFields } from "../types/thread-control-types.ts";
import { ThreadControlTitle } from "./thread-control-title.tsx";
import { ThreadControlDescription } from "./thread-control-description.tsx";
import { ThreadControlComments } from "./thread-control-comments.tsx";
import { ThreadControlSave } from "#thread/components/thread-control/components/thread-control-save.tsx";

export const ThreadControlMain = ({
  id: threadId,
}: Pick<ThreadControlFields, "id">) => {
  const { data: currentThread } = currentThreadQuery(threadId);
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
        <ThreadControlComments isComments={currentThread.isComments} />
        <div className="flex items-center gap-2 justify-end w-full">
          <ThreadControlSave threadId={threadId} />
          <ThreadRemoveModal id={currentThread.id} />
        </div>
      </div>
    </div>
  );
};
