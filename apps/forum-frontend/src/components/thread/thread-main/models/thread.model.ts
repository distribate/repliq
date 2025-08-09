import { threadReactionsAction } from "#components/thread/thread-reactions/models/thread-reactions.model";
import { currentUserNicknameAtom } from "#components/user/models/current-user.model";
import { action, atom, batch } from "@reatom/core";
import { withReset } from "@reatom/framework";
import { withHistory } from '#lib/with-history';
import { forumThreadClient } from "#shared/forum-client";
import { ThreadDetailed, ThreadOwner } from "@repo/types/entities/thread-type";

export async function getThreadModel(
  id: string,
  { headers }: RequestInit
) {
  const res = await forumThreadClient.thread['get-thread'][':id'].$get({ param: { id } }, { init: { headers } });
  const data = await res.json();
  if ('error' in data) throw new Error(data.error)

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
export const threadImagesAtom = atom<string[] | null>(null, "threadImages")

export const threadModeAtom = atom<"read" | "edit">("read", "threadMode")
export const threadIsEditableAtom = atom(false, "threadIsEditable")

threadOwnerAtom.onChange((ctx, state) => {
  if (!state) return;

  const currentUser = ctx.get(currentUserNicknameAtom)
  if (!currentUser) return;

  const allowed = [state.nickname]
  const isAllowed = allowed.includes(currentUser)

  threadIsEditableAtom(ctx, isAllowed)
})

export const defineThread = action((ctx, target: ThreadDetailed) => {
  const { owner, content, properties, ...rest } = target;

  batch(ctx, () => {
    threadReactionsAction(ctx, target.id)
    threadParamAtom(ctx, rest.id)
    threadOwnerAtom(ctx, owner)
    threadContentAtom(ctx, content)
    threadPropertiesAtom(ctx, properties)
    threadAtom(ctx, rest);
    threadImagesAtom(ctx, rest.images.length >= 1 ? rest.images : null)
  })
}, "defineThread")