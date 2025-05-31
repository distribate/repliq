import { AvailableThreadReactions } from "#components/reactions/components/available-reactions";
import { threadIsEditableAtom, threadModeAtom, threadParamAtom } from "../thread-main/models/thread.model";
import { FlagTriangleLeft, PencilLine } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography";
import { ReportCreateModal } from "#components/modals/action-confirmation/components/report/components/report-create-modal.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { ContextMenuItem } from "@repo/ui/src/components/context-menu";

const ThreadContentEdit = reatomComponent(({ ctx }) => {
  const threadIsEditable = ctx.spy(threadIsEditableAtom)
  if (!threadIsEditable) return null;
  
  const editMode = ctx.spy(threadModeAtom)

  return editMode === 'read' ? (
    <div
      className="flex items-center rounded-md gap-2"
      onClick={() => threadModeAtom(ctx, "edit")}
    >
      <PencilLine size={20} className="text-shark-300" />
      <Typography>Редактировать</Typography>
    </div>
  ) : (
    <div
      className="flex items-center rounded-md gap-2"
      onClick={() => threadModeAtom(ctx, "read")}
    >
      <PencilLine size={20} className="text-shark-300" />
      <Typography>Отменить</Typography>
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
  const threadId = ctx.spy(threadParamAtom)
  if (!threadId) return null;

  return (
    <>
      <AvailableThreadReactions threadId={threadId} />
      <div className="px-2 w-full">
        <div className="flex flex-col bg-shark-900 *:cursor-pointer hover:*:bg-shark-700 w-full py-2 gap-2">
          <ContextMenuItem>
            <ThreadContentEdit />
          </ContextMenuItem>
          <ContextMenuItem>
            <ThreadContentReport threadId={threadId} />
          </ContextMenuItem>
        </div>
      </div>
    </>
  )
}, "ThreadContextMenu")