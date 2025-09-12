import { toast } from "sonner";
import { latestThreadsByCategoriesAction } from "#components/category/latest-threads/models/latest-threads.model";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { threadClient } from "#shared/api/forum-client";
import { Descendant } from "slate";
import { ThreadDetailed } from "@repo/types/entities/thread-type";
import { atom } from "@reatom/core";
import { withReset } from "@reatom/framework";
import { navigate } from "vike/client/router";
import { prefetch } from 'vike/client/router'
import { validateResponse } from "#shared/api/validation";

type ThreadControlValues = Pick<ThreadDetailed, | "title" | "description" | "properties"> & {
  content: Descendant[];
};

type ThreadControl = {
  isValid: boolean
}

export const threadControlValuesAtom = atom<ThreadControlValues | null>(null, "threadControlValues")
export const threadControlAtom = atom<ThreadControl>({ isValid: false }, "threadControl").pipe(withReset())

async function removeThread(id: string) {
  const res = await threadClient.thread["remove"][":id"].$delete({ param: { id } });
  return validateResponse<typeof res>(res)
}

async function updateThread({ 
  threadId, values 
}: {
  threadId: string;
  values: ThreadControlValues;
}) {
  const { description, title, content, properties } = values;

  const res = await threadClient.thread["update-settings"].$post({
    json: {
      threadId,
      new_description: description,
      new_title: title,
      new_tags: undefined,
      is_comments: properties.is_comments.toString(),
    },
  });

  return validateResponse<typeof res>(res)
}

export const removeThreadAction = reatomAsync(async (ctx, threadId: string) => {
  return await ctx.schedule(() => removeThread(threadId))
}, {
  name: "removeThreadAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      toast.error("Произошла ошибка при удалении треда", { description: e.message });
    }
  },
  onFulfill: async (ctx, res) => {
    latestThreadsByCategoriesAction(ctx)

    prefetch("/");
    
    return ctx.schedule(() => navigate("/"));
  }
}).pipe(withStatusesAtom())

export const updateThreadAction = reatomAsync(async (ctx, threadId: string) => {
  const newData = ctx.get(threadControlValuesAtom)

  if (!newData) {
    throw new Error("no-update-fields")
  }

  const values = Object.fromEntries(
    Object.entries(newData).filter(([_, value]) => value !== undefined && value !== null),
  ) as ThreadControlValues;

  return await updateThread({ threadId, values });
}, {
  name: "updateThreadAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      if (e.message === 'no-update-fields') {
        return toast.info("Ничего не было обновлено");
      }

      toast.error("Произошла ошибка при обновлении", { description: e.message });
    }
  },
  onFulfill: (ctx, res) => {
  
  }
}).pipe(withStatusesAtom())