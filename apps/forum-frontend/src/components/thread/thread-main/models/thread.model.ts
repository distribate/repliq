import { threadImagesAction } from "#components/thread/thread-images/models/thread-images.model";
import { threadReactionsAction } from "#components/thread/thread-reactions/models/thread-reactions.model";
import { currentUserNicknameAtom } from "#components/user/models/current-user.model";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { atom, Ctx } from "@reatom/core";
import { withReset } from "@reatom/framework";
import { withHistory } from "@repo/lib/utils/reatom/with-history";
import { forumThreadClient } from "@repo/shared/api/forum-client";
import { ThreadDetailed, ThreadOwner } from "@repo/types/entities/thread-type";

export async function getThreadModel(
  threadId: string,
  { headers }: RequestInit
) {
  const res = await forumThreadClient.thread['get-thread'][':threadId'].$get(
    { param: { threadId }}, 
    { init: { headers } }
  );

  const data = await res.json();

  if (!data || 'error' in data) return null;

  return data.data;
}

export const threadContentfallback = [
  { type: "paragraph", children: [{ text: "Произошла ошибка при загрузке контента!" }] },
];

export const threadParamAtom = atom<string | null>(null, "threadParam").pipe(withHistory(1))
export const threadAtom = atom<Omit<ThreadDetailed, "content" | "owner" | "properties"> | null>(null, "thread").pipe(withReset())
export const threadOwnerAtom = atom<ThreadOwner | null>(null, "threadOwner").pipe(withReset())
export const threadContentAtom = atom<ThreadDetailed["content"] | null>(null, "threadContent").pipe(withReset())
export const threadPropertiesAtom = atom<ThreadDetailed["properties"] | null>(null, "threadProperties")

export const threadModeAtom = atom<"read" | "edit">("read", "threadMode")
export const threadIsEditableAtom = atom(false, "threadIsEditable")

export function resetThread(ctx: Ctx) {
  threadAtom.reset(ctx)
  threadOwnerAtom.reset(ctx)
  threadContentAtom.reset(ctx)
}

threadOwnerAtom.onChange((ctx, state) => {
  if (!state) return;

  const currentUser = ctx.get(currentUserNicknameAtom)
  if (!currentUser) return;

  const allowed = [state.nickname]
  const isAllowed = allowed.includes(currentUser)

  threadIsEditableAtom(ctx, isAllowed)
})

export const defineThread = reatomAsync(async (ctx, target: ThreadDetailed) => {
  return target;
}, {
  name: "defineThreadAction",
  onFulfill: (ctx, res) => {
    const { owner, content, properties, ...rest } = res;

    threadReactionsAction(ctx, res.id)

    if (res.images_count >= 1) {
      threadImagesAction(ctx)
    }

    threadParamAtom(ctx, rest.id)
    threadOwnerAtom(ctx, owner)
    threadContentAtom(ctx, content)
    threadPropertiesAtom(ctx, properties)
    threadAtom(ctx, rest)
  }
}).pipe(withStatusesAtom())