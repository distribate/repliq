import { AvailableThreadReactions } from "#reactions/components/available-reactions.tsx";
import { getUser } from "@repo/lib/helpers/get-user";
import { ThreadDetailed } from "@repo/types/entities/thread-type";
import { useQueryClient } from "@tanstack/react-query";
import { THREAD_QUERY_KEY } from "../thread-main/queries/thread-query";
import { THREAD_CONTROL_QUERY_KEY, ThreadControlQuery } from "../thread-control/queries/thread-control-query";
import { PencilLine } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography";

type ThreadContextMenuProps = {
  threadId: string
}

const ThreadContentEdit = () => {
  const qc = useQueryClient();

  const handleContentEdit = () => {
    return qc.setQueryData(
      THREAD_CONTROL_QUERY_KEY,
      (prev: ThreadControlQuery) => ({
        state: {
          ...prev.state,
          isContenteditable: true
        },
        values: { ...prev.values },
      }),
    )
  };

  return (
    <div
      className="flex items-center rounded-md hover:bg-shark-800 cursor-pointer gap-2"
      onClick={handleContentEdit}
    >
      <PencilLine size={20} />
      <Typography>Редактировать</Typography>
    </div>
  )
}

export const ThreadContextMenu = ({
  threadId
}: ThreadContextMenuProps) => {
  const qc = useQueryClient()
  const thread = qc.getQueryData<ThreadDetailed>(THREAD_QUERY_KEY(threadId))
  const { nickname } = getUser()

  if (!thread) return null;

  const isOwner = thread.owner.nickname === nickname

  return (
    <>
      <AvailableThreadReactions threadId={threadId} />
      {isOwner && (
        <div className="flex flex-col bg-shark-800 p-2 rounded-md gap-1">
          <ThreadContentEdit />
        </div>
      )}
    </>
  )
};