import { threadImagesAction } from "#components/thread/thread-images/models/thread-images.model";
import { threadReactionsAction } from "#components/thread/thread-reactions/models/thread-reactions.model";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { atom, Ctx } from "@reatom/core";
import { withReset } from "@reatom/framework";
import { currentUserNicknameAtom } from "@repo/lib/helpers/get-user";
import { withHistory } from "@repo/lib/utils/reatom/with-history";
import { forumThreadClient } from "@repo/shared/api/forum-client";
import { ThreadDetailed, ThreadOwner } from "@repo/types/entities/thread-type";

export async function getThreadModel(threadId: string) {
  const res = await forumThreadClient.thread['get-thread'][':threadId'].$get({ param: { threadId }, });
  const data = await res.json();

  if (!data || 'error' in data) return null;

  return data.data;
}

export const threadContentfallback = [
  { type: "paragraph", children: [{ text: "Произошла ошибка при загрузке контента!" }] },
];

export const threadParamAtom = atom<string | null>(null, "threadParam").pipe(withHistory(1))
export const threadPreviewAtom = atom<{ title: string, id: string } | null>(null, "threadPreview")
export const threadAtom = atom<Omit<ThreadDetailed, "content" | "owner"> | null>(null, "thread").pipe(withReset())
export const threadOwnerAtom = atom<ThreadOwner | null>(null, "threadOwner").pipe(withReset())
export const threadContentAtom = atom<ThreadDetailed["content"] | null>(null, "threadContent").pipe(withReset())

export const threadModeAtom = atom<"read" | "edit">("read", "threadMode")
export const threadIsEditableAtom = atom(false, "threadIsEditable")

function resetThread(ctx: Ctx) {
  threadAtom.reset(ctx)
  threadOwnerAtom.reset(ctx)
  threadContentAtom.reset(ctx)
}

threadParamAtom.onChange((ctx, state) => {
  const prev = ctx.get(threadParamAtom.history)[1];

  if (prev !== undefined && prev !== state) {
    threadPreviewAtom(ctx, null);
  }
});

threadOwnerAtom.onChange((ctx, state) => {
  if (!state) return;

  const currentUser = ctx.get(currentUserNicknameAtom)
  if (!currentUser) return;

  const allowed = [state.nickname]
  const isAllowed = allowed.includes(currentUser)

  threadIsEditableAtom(ctx, isAllowed)
})

threadParamAtom.onChange((ctx, target) => {
  if (!target) return;

  const prev = ctx.get(threadParamAtom.history)[1]

  if (prev !== undefined && prev !== target) {
    resetThread(ctx)
  }

  defineThreadAction(ctx, target)
})

export const defineThreadAction = reatomAsync(async (ctx, threadId: string) => {
  return await ctx.schedule(() => getThreadModel(threadId))
}, {
  name: "defineThreadAction",
  onFulfill: (ctx, res) => {
    if (!res) {
      return;
    }

    const { owner, content, ...rest } = res;

    threadReactionsAction(ctx, res.id)

    if (res.images_count >= 1) {
      threadImagesAction(ctx)
    }

    threadOwnerAtom(ctx, owner)
    threadContentAtom(ctx, content)
    threadAtom(ctx, rest)
  }
}).pipe(withStatusesAtom())