import { threadReactionsAction } from "#components/thread/thread-reactions/models/thread-reactions.model";
import { currentUserNicknameAtom } from "#components/user/models/current-user.model";
import { action, atom, batch } from "@reatom/core";
import { withReset } from "@reatom/framework";
import { withHistory } from '#lib/with-history';
import { forumThreadClient } from "#shared/forum-client";
import { ThreadDetailed, ThreadOwner } from "@repo/types/entities/thread-type";
import { Value } from "@udecode/plate";

export async function getThreadModel(id: string, { headers }: RequestInit) {
  const res = await forumThreadClient.thread['get-thread'][':id'].$get({ param: { id } }, { init: { headers } });
  const data = await res.json();
  if ('error' in data) throw new Error(data.error)

  return data.data;
}

export const threadContentfallback = [
  { type: "paragraph", children: [{ text: "Произошла ошибка при загрузке контента!" }] },
];

export const threadParamAtom = atom<string>("", "threadParam").pipe(withHistory(1))

export const threadAtom = atom<Omit<ThreadDetailed, "content" | "owner" | "properties"> | null>(null, "thread").pipe(withReset())
export const threadOwnerAtom = atom<ThreadOwner | null>(null, "threadOwner").pipe(withReset())
export const threadContentAtom = atom<Value | null>(null, "threadContent").pipe(withReset())
export const threadPropertiesAtom = atom<ThreadDetailed["properties"] | null>(null, "threadProperties")
export const threadImagesAtom = atom<string[] | null>(null, "threadImages")

export const threadModeAtom = atom<"read" | "edit">("read", "threadMode")

export const threadIsEditableAtom = atom((ctx) => {
  const currentUser = ctx.get(currentUserNicknameAtom)
  if (!currentUser) return;

  const state = ctx.spy(threadOwnerAtom);
  if (!state) return;

  const allowed = [state.nickname]
  const isAllowed = allowed.includes(currentUser)

  return isAllowed
}, "threadIsEditable")

export const defineThread = action((ctx, target: ThreadDetailed) => {
  const { content, owner, properties, ...rest } = target;

  batch(ctx, () => {
    threadParamAtom(ctx, rest.id)
    threadAtom(ctx, rest);
    threadOwnerAtom(ctx, owner)
    threadContentAtom(ctx, content)
    threadImagesAtom(ctx, target.images.length >= 1 ? target.images : null)
    threadPropertiesAtom(ctx, properties)
  });

  threadReactionsAction(ctx, rest.id)
}, "defineThread")