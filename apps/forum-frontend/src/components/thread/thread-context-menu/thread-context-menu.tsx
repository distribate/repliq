import { AvailableThreadReactions } from "#components/reactions/components/available-reactions";
import { threadParamAtom } from "../thread-main/models/thread.model";
import { FlagTriangleLeft } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography";
import { ReportCreateModal } from "#components/modals/action-confirmation/components/report/components/report-create-modal.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { ContextMenuItem } from "@repo/ui/src/components/context-menu";

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
  const threadId = ctx.spy(threadParamAtom)
  if (!threadId) return null;

  return (
    <>
      <AvailableThreadReactions threadId={threadId} />
      <div className="px-1.5 w-full">
        <div className="flex flex-col bg-shark-900 rounded-md *:cursor-pointer hover:*:bg-shark-700 w-full p-1.5 gap-2">
          <ContextMenuItem>
            <ThreadContentReport threadId={threadId} />
          </ContextMenuItem>
        </div>
      </div>
    </>
  )
}, "ThreadContextMenu")