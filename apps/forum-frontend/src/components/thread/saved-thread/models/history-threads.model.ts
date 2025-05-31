import { currentUserNicknameAtom } from "@repo/lib/helpers/get-user.ts";
import { globalPreferencesAtom } from "@repo/lib/queries/global-preferences.model";
import { action, atom } from "@reatom/core";
import { withLocalStorage } from "@reatom/persist-web-storage";

export type ThreadHistoryType = {
  thread: {
    id: string;
    owner: string;
    title: string;
  },
  account: string;
};

export const HISTORY_THREADS_KEY = "history-threads";

const MAX_HISTORY = 2;

const historyThreadsAtom = atom<ThreadHistoryType[]>([], "historyThreads").pipe(
  withLocalStorage("threads-history")
)

type UpdateHistoryOptions = (
  | { type: "save", data: Omit<ThreadHistoryType, "account"> }
  | { type: "delete", data: string }
)

export const updateHistoryThreadsAction = action((ctx, options: UpdateHistoryOptions) => {
  const preference = ctx.get(globalPreferencesAtom).autoSaveThreads
  const account = ctx.get(currentUserNicknameAtom)
  if (!account) return null;

  switch (options.type) {
    case "save":
      if (!preference) return;

      const { thread } = options.data

      return historyThreadsAtom(ctx, (state) => {
        let threadObjects: ThreadHistoryType[] = state ?? [];

        const exists = threadObjects.some(
          i => i.thread.id === thread.id && i.account === account,
        );

        if (exists) return threadObjects;

        if (threadObjects.length < MAX_HISTORY) {
          return [...threadObjects, { account, thread }];
        } else {
          return [...threadObjects.slice(1), { account, thread }];
        }
      });
    case "delete":
      const threadId = options.data;

      return historyThreadsAtom(ctx, (state) => {
        if (!state) return []

        const threadObjects = state.filter(
          i => !(i.thread.id === threadId && i.account === account)
        );

        return threadObjects.length === 0 ? [] : threadObjects;
      });
  }
})