import { threadParamAtom, threadPropertiesAtom } from "#components/thread/thread-main/models/thread.model";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { atom } from "@reatom/core";
import { reatomComponent } from "@reatom/npm-react";
import { forumThreadClient } from "@repo/shared/api/forum-client";
import { IconBookmark, IconBookmarkFilled } from "@tabler/icons-react";
import { toast } from "sonner";

async function saveThread(id: string) {
  const res = await forumThreadClient.thread["save-thread"][":id"].$post({ param: { id } })
  const data = await res.json()
  return data
}

async function unsaveThread(id: string) {
  const res = await forumThreadClient.thread["unsave-thread"][":id"].$post({ param: { id } })
  const data = await res.json()
  return data
}

const saveThreadActionVariablesAtom = atom<{ id: string, type: "save" | "unsave" } | null>(null, "saveThreadActionVariables")

const saveThreadAction = reatomAsync(async (ctx, id: string, type: "save" | "unsave") => {
  saveThreadActionVariablesAtom(ctx, { id, type })

  if (type === 'save') {
    return await ctx.schedule(() => saveThread(id))
  }

  if (type === 'unsave') {
    return await ctx.schedule(() => unsaveThread(id))
  }
}, {
  name: "saveThreadAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    if ("error" in res) {
      toast.error(res.error)
      return;
    }

    const variables = ctx.get(saveThreadActionVariablesAtom)
    if (!variables) return;

    if (res.data) {
      toast.success("Тред сохранен")
      threadPropertiesAtom(ctx, (state) => state ? ({ ...state, is_saved: variables.type === 'save' ? true : false }) : null)
    }
  }
}).pipe(withStatusesAtom())

export const ThreadSave = reatomComponent<{ isMarked: boolean }>(({ ctx, isMarked }) => {
  const threadId = ctx.get(threadParamAtom)
  if (!threadId) return;

  const isPending = ctx.spy(saveThreadAction.statusesAtom).isPending

  const handle = () => {
    if (isPending) return;

    saveThreadAction(ctx, threadId, isMarked ? "unsave" : "save")
  }

  return (
    <div
      data-state={isPending ? "active" : "inactive"}
      onClick={handle} 
      className="flex items-center rounded-lg h-full cursor-pointer py-2 px-4 hover:bg-shark-700 bg-shark-800 overflow-hidden 
        data-[state=active]:cursor-not-allowed data-[state=active]:opacity-75"
    >
      {isMarked ? (
        <IconBookmarkFilled size={20} className="text-shark-50" />
      ) : (
        <IconBookmark size={20} className="text-shark-300" />
      )}
    </div>
  );
}, "ThreadSave")