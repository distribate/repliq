import { threadPropertiesAtom } from "#components/thread/models/thread.model"
import { threadClient } from "#shared/api/forum-client"
import { reatomAsync, withStatusesAtom } from "@reatom/async"
import { atom } from "@reatom/core"
import { sleep } from "@reatom/framework"
import { toast } from "sonner"

async function saveThread(id: string) {
  const res = await threadClient.thread["save"][":id"].$post({ param: { id } })
  const data = await res.json()
  if ("error" in data) throw new Error(data.error)
  return data.data
}

async function unsaveThread(id: string) {
  const res = await threadClient.thread["unsave"][":id"].$post({ param: { id } })
  const data = await res.json()
  if ("error" in data) throw new Error(data.error)
  return data.data
}

type SaveThreadActionVariables = {
  id: string,
  type: "save" | "unsave"
}

const saveThreadActionVariablesAtom = atom<SaveThreadActionVariables | null>(null, "saveThreadActionVariables")

export const saveThreadAction = reatomAsync(async (ctx, id: string, type: "save" | "unsave") => {
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
  onFulfill: async (ctx, data) => {
    const variables = ctx.get(saveThreadActionVariablesAtom)
    if (!variables) return;

    await ctx.schedule(() => sleep(40));

    threadPropertiesAtom(ctx, (state) => state ? ({
      ...state,
      is_saved: variables.type === 'save' ? true : false
    }) : null)
  }
}).pipe(withStatusesAtom())