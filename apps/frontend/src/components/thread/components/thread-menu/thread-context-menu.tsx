import { ThreadReactionsAvailable } from "#components/thread/components/thread-reactions/components/thread-reactions-available";
import { threadParamAtom } from "../../models/thread.model";
import { FlagTriangleLeft } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography";
import { ReportCreateModal } from "#components/modals/with-confirm/report/components/report-create-modal";
import { reatomComponent } from "@reatom/npm-react";
import { ContextMenuItem } from "@repo/ui/src/components/context-menu";

const ThreadContentReport = ({ id }: { id: string }) => {
  const trigger = (
    <div className="flex items-center rounded-md gap-2">
      <FlagTriangleLeft size={20} className="text-shark-300" />
      <Typography>Пожаловаться</Typography>
    </div>
  )

  return (
    <ReportCreateModal
      type="thread"
      targetId={id}
      trigger={trigger}
    />
  )
}

export const ThreadContextMenu = reatomComponent(({ ctx }) => {
  const threadId = ctx.spy(threadParamAtom)
  
  return (
    <>
      <ThreadReactionsAvailable id={threadId} />
      <div className="px-1.5 w-full">
        <div className="flex flex-col bg-shark-900 rounded-md *:cursor-pointer hover:*:bg-shark-700 w-full p-1.5 gap-2">
          <ContextMenuItem>
            <ThreadContentReport id={threadId} />
          </ContextMenuItem>
        </div>
      </div>
    </>
  )
}, "ThreadContextMenu")