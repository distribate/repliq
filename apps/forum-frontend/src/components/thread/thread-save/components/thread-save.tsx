import { threadParamAtom, threadPropertiesAtom } from "#components/thread/thread-main/models/thread.model";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { atom } from "@reatom/core";
import { reatomComponent } from "@reatom/npm-react";
import { forumThreadClient } from "#shared/forum-client";
import { IconBookmark, IconBookmarkFilled } from "@tabler/icons-react";
import { toast } from "sonner";

async function saveThread(id: string) {
  const res = await forumThreadClient.thread["save-thread"][":id"].$post({ param: { id } })
  const data = await res.json()
  if ("error" in data) throw new Error(data.error)
  return data.data
}

async function unsaveThread(id: string) {
  const res = await forumThreadClient.thread["unsave-thread"][":id"].$post({ param: { id } })
  const data = await res.json()
  if ("error" in data) throw new Error(data.error)
  return data.data
}

type SaveThreadActionVariables = {
  id: string, 
  type: "save" | "unsave"
}

const saveThreadActionVariablesAtom = atom<SaveThreadActionVariables | null>(null, "saveThreadActionVariables")

const CALLBACK_MESSAGES: Record<SaveThreadActionVariables["type"], string> = {
  "save": "Тред сохранен",
  "unsave": "Тред удален"
}

const saveThreadAction = reatomAsync(async (ctx, id: string, type: "save" | "unsave") => {
  saveThreadActionVariablesAtom(ctx, { id, type })

  if (type === 'save') {
    return await ctx.schedule(() => saveThread(id))
  }

  if (type === 'unsave') {
    return await ctx.schedule(() => unsaveThread(id))
  }

  throw new Error()
}, {
  name: "saveThreadAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      toast.error(e.message)
    }
  },
  onFulfill: (ctx, data) => {
    const variables = ctx.get(saveThreadActionVariablesAtom)
    if (!variables) return;

    toast.success(CALLBACK_MESSAGES[variables.type])

    import.meta.env.DEV && console.log(variables.type, data)

    threadPropertiesAtom(ctx, (state) => state ? ({
      ...state,
      is_saved: variables.type === 'save' ? true : false
    }) : null)
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