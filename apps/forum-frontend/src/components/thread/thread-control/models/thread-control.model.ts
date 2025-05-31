import { toast } from "sonner";
import { categoriesResource } from "#components/categories/components/categories-list/models/categories.model.ts";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { router } from "#main.tsx";
import { forumThreadClient } from "@repo/shared/api/forum-client";
import { Descendant } from "slate";
import { ThreadDetailed } from "@repo/types/entities/thread-type";
import { atom } from "@reatom/core";
import { withReset } from "@reatom/framework";

export type ThreadControlQueryValues = Pick<
  ThreadDetailed,
  | "title"
  | "description"
  | "properties"
> & {
  content: Descendant[];
};

type ThreadControl = {
  state: {
    isValid: boolean;
  }
  values: Partial<ThreadControlQueryValues> | null;
}

export const threadControlAtom = atom<ThreadControl>({
  state: {
    isValid: false,
  },
  values: null,
}, "threadControl").pipe(withReset())

async function removeThread(threadId: string) {
  const res = await forumThreadClient.thread["remove-thread"][":threadId"].$delete({
    param: { threadId },
  });

  const data = await res.json();

  if (!data || "error" in data) {
    return null;
  }

  return data;
}

type UpdateThread = {
  threadId: string;
  values: ThreadControlQueryValues;
};

async function updateThread({ threadId, values }: UpdateThread) {
  const { description, title, content, properties } = values;

  const res = await forumThreadClient.thread["update-thread-settings"].$post({
    json: {
      threadId,
      new_description: description,
      new_title: title,
      new_tags: undefined,
      is_comments: properties.is_comments.toString(),
    },
  });

  const data = await res.json();

  if (!data || "error" in data) {
    return null
  }

  return data;
}

export const removeThreadAction = reatomAsync(async (ctx, threadId: string) => {
  return await ctx.schedule(() => removeThread(threadId))
}, {
  name: "removeThreadAction",
  onFulfill: (ctx, res) => {
    if (!res) return toast.error("Произошла ошибка при удалении треда");

    // await Promise.all([
      // replace to threadAtom
      // qc.resetQueries({ queryKey: THREAD_QUERY_KEY(variables) }),
      // replace to threadReactionsAtom
      // qc.resetQueries({ queryKey: THREAD_REACTIONS_QUERY_KEY(variables) }),
    // ]);

    categoriesResource(ctx)
    return ctx.schedule(() => router.navigate({ to: "/" }));
  }
}).pipe(withStatusesAtom())

export const updateThreadAction = reatomAsync(async (ctx, threadId: string) => {
  const newData = ctx.get(threadControlAtom)

  if (!newData) return "no-update-fields";

  const values: ThreadControlQueryValues = Object.fromEntries(
    Object.entries(newData).filter(
      ([_, value]) => value !== undefined && value !== null,
    ),
  ) as ThreadControlQueryValues;

  return await updateThread({ threadId, values });
}, {
  name: "updateThreadAction",
  onFulfill: (_, res) => {
    if (!res) return toast.error("Произошла ошибка при обновлении");

    if (res === "no-update-fields")
      return toast.info("Ничего не было обновлено");

    router.invalidate()
    // await Promise.all([
    // replace to threadAtom
    // qc.invalidateQueries({ queryKey: THREAD_QUERY_KEY(variables) }),
    // replace to threadReactionsAtom
    // qc.invalidateQueries({ queryKey: THREAD_REACTIONS_QUERY_KEY(variables) }),
    // qc.resetQueries({ queryKey: THREAD_CONTROL_QUERY_KEY })
    // ])
  }
})
