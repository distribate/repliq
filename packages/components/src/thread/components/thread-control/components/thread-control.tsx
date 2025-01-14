"use client";

import { Button } from "@repo/ui/src/components/button.tsx";
import { ThreadControlMain } from "./thread-control-main.tsx";
import { PencilLine } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { DynamicModal } from "#modals/dynamic-modal.tsx";
import { THREAD_CONTROL_MUTATION_KEY } from "#thread/components/thread-control/hooks/use-thread-control.ts";
import { useQueryClient } from "@tanstack/react-query";
import { ThreadDetailed } from "@repo/types/entities/thread-type.ts";
import { THREAD_QUERY_KEY } from "#thread/components/thread-main/queries/thread-query.ts";
import { getUser } from "@repo/lib/helpers/get-user.ts";

type ThreadControlProps = {
  threadId: string;
}

export const ThreadControl = ({ threadId }: ThreadControlProps) => {
  const qc = useQueryClient()
  const thread = qc.getQueryData<ThreadDetailed>(THREAD_QUERY_KEY(threadId))
  const currentUser = getUser()

  if (!thread) return null

  const isThreadOwner = thread.owner.nickname === currentUser.nickname

  if (!isThreadOwner) return null;

  return (
    <DynamicModal
      mutationKey={THREAD_CONTROL_MUTATION_KEY}
      contentClassName="max-w-4xl pb-4"
      trigger={
        <Button className="w-full" state="default">
          <div className="flex items-center gap-2">
            <PencilLine size={20} />
            <Typography textSize="medium">Редактировать</Typography>
          </div>
        </Button>
      }
      content={<ThreadControlMain threadId={threadId} />}
    />
  );
};
