import { updateHistoryThreadsAction } from "../saved-thread/models/history-threads.model.ts";
import { THREAD_URL } from "@repo/shared/constants/routes.ts";
import { PropsWithChildren } from "react";
import { ThreadDetailed } from "@repo/types/entities/thread-type.ts";
import { reatomComponent } from "@reatom/npm-react";
import { CustomLink } from "#components/shared/link.tsx";
import { threadPreviewAtom } from "../thread-main/models/thread.model.ts";

type ThreadLayout = PropsWithChildren & Pick<ThreadDetailed, "id" | "owner" | "title">;

export const ThreadLayout = reatomComponent<ThreadLayout>(({ ctx, children, title, owner, id }) => {
  const thread = { thread: { title, owner: owner.nickname, id } }

  return (
    <CustomLink
      to={THREAD_URL + id}
      onClick={() => {
        threadPreviewAtom(ctx, { title, id })
        updateHistoryThreadsAction(ctx, { type: "save", data: thread })
      }}
    >
      {children}
    </CustomLink>
  );
}, "ThreadLayout")