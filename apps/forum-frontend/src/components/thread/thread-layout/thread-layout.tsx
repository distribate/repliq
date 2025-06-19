import { updateHistoryThreadsAction } from "../saved-thread/models/history-threads.model.ts";
import { PropsWithChildren } from "react";
import { ThreadDetailed } from "@repo/types/entities/thread-type.ts";
import { reatomComponent } from "@reatom/npm-react";
import { CustomLink } from "#components/shared/link.tsx";
import { createIdLink } from "@repo/lib/utils/create-link.ts";

type ThreadLayout = PropsWithChildren & Pick<ThreadDetailed, "id" | "owner" | "title">;

export const ThreadLayout = reatomComponent<ThreadLayout>(({ ctx, children, title, owner, id }) => {
  const thread = { thread: { title, owner: owner.nickname, id } }

  return (
    <CustomLink
      to={createIdLink("thread", id)}
      onClick={() => {
        updateHistoryThreadsAction(ctx, { type: "save", data: thread })
      }}
    >
      {children}
    </CustomLink>
  );
}, "ThreadLayout")