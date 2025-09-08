import { updateHistoryThreadsAction } from "../thread-history/models/history-threads.model.ts";
import { PropsWithChildren } from "react";
import { ThreadDetailed } from "@repo/types/entities/thread-type.ts";
import { reatomComponent } from "@reatom/npm-react";
import { CustomLink } from "#shared/components/link.tsx";
import { createIdLink } from "#lib/create-link.ts";

type ThreadLayout = PropsWithChildren & Pick<ThreadDetailed, "id" | "owner" | "title">;

export const ThreadLayout = reatomComponent<ThreadLayout>(({ ctx, children, title, owner, id }) => {
  const thread = { thread: { title, owner: owner.nickname, id } }

  return (
    <CustomLink
      to={createIdLink("thread", id)}
      data-prefetch-static-assets="hover"
      onClick={() => {
        updateHistoryThreadsAction(ctx, { type: "save", data: thread })
      }}
    >
      {children}
    </CustomLink>
  );
}, "ThreadLayout")