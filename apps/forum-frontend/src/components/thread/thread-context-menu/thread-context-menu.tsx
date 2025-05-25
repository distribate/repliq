import { AvailableThreadReactions } from "#components/reactions/components/available-reactions";
import { getUser } from "@repo/lib/helpers/get-user";
import { threadAtom } from "../thread-main/models/thread.model";
import { FlagTriangleLeft, PencilLine } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography";
import { ReportCreateModal } from "#components/modals/action-confirmation/components/report/components/report-create-modal.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { threadControlAtom } from "../thread-control/models/thread-control.model";

const ThreadContentEdit = reatomComponent(({ ctx }) => {
  return (
    <div
      className="flex items-center rounded-md gap-2"
      onClick={() => {
        threadControlAtom(ctx, (prev) => ({
          state: {
            ...prev.state,
            isContenteditable: true
          },
          values: { ...prev.values },
        }))
      }}
    >
      <PencilLine size={20} className="text-shark-300" />
      <Typography>Редактировать</Typography>
    </div>
  )
}, "ThreadContentEdit")

const ThreadContentReport = ({ threadId }: { threadId: string }) => {
  return (
    <ReportCreateModal
      reportType="thread"
      targetNickname="as"
      threadId={threadId}
      targetId={threadId}
      customTrigger={
        <div className="flex items-center rounded-md gap-2">
          <FlagTriangleLeft size={20} className="text-shark-300" />
          <Typography>Пожаловаться</Typography>
        </div>
      }
    />
  )
}

export const ThreadContextMenu = reatomComponent(({ ctx }) => {
  const thread = ctx.spy(threadAtom)
  const currentUser = getUser(ctx)

  if (!thread) return null;

  return (
    <div className="flex flex-col w-full p-2 rounded-md gap-2">
      <AvailableThreadReactions threadId={thread.id} />
      <div className="px-2 w-full">
        <div className="flex flex-col bg-shark-900 *:px-2 *:py-1 *:cursor-pointer hover:*:bg-shark-700 rounded-md w-full py-2 gap-2">
          {currentUser.nickname === thread.owner.nickname && <ThreadContentEdit />}
          <ThreadContentReport threadId={thread.id} />
        </div>
      </div>
    </div>
  )
}, "ThreadContextMenu")