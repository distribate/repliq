import { AvailableThreadReactions } from "#reactions/components/available-reactions.tsx";
import { getUser } from "@repo/lib/helpers/get-user";
import { ThreadDetailed } from "@repo/types/entities/thread-type";
import { useQueryClient } from "@tanstack/react-query";
import { THREAD_QUERY_KEY } from "../thread-main/queries/thread-query";
import { THREAD_CONTROL_QUERY_KEY, ThreadControlQuery } from "../thread-control/queries/thread-control-query";
import { FlagTriangleLeft, PencilLine } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography";
import { ReportCreateModal } from "#modals/action-confirmation/components/report/components/report-create-modal.tsx";

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
      className="flex items-center rounded-md gap-2"
      onClick={handleContentEdit}
    >
      <PencilLine size={20} className="text-shark-300" />
      <Typography>Редактировать</Typography>
    </div>
  )
}

const ThreadContentReport = ({ threadId }: { threadId: string }) => {
  return (
    <ReportCreateModal
      reportType="thread"
      targetNickname="as"
      threadId={threadId}
      targetId={threadId}
      customTrigger={
        <div
          className="flex items-center rounded-md gap-2"
        >
          <FlagTriangleLeft size={20} className="text-shark-300" />
          <Typography>Пожаловаться</Typography>
        </div>
      }
    />
  )
}

export const ThreadContextMenu = ({
  threadId
}: ThreadContextMenuProps) => {
  const qc = useQueryClient()
  const thread = qc.getQueryData<ThreadDetailed>(THREAD_QUERY_KEY(threadId))
  const currentUser = getUser()

  if (!thread) return null;

  return (
    <div className="flex flex-col w-full p-2 rounded-md gap-2">
      <AvailableThreadReactions threadId={threadId} />
      <div className="px-2 w-full">
        <div className="flex flex-col bg-shark-900 *:px-2 *:py-1 *:cursor-pointer hover:*:bg-shark-700 rounded-md w-full py-2 gap-2">
          {currentUser.nickname === thread.owner.nickname && <ThreadContentEdit />}
          <ThreadContentReport threadId={threadId} />
        </div>
      </div>
    </div>
  )
};