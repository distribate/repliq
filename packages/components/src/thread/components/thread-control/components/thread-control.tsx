"use client";

import { Button } from "@repo/ui/src/components/button.tsx";
import { ThreadControlMain } from "./thread-control-main.tsx";
import { PencilLine } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { DynamicModal } from "#modals/dynamic-modal.tsx";
import { THREAD_CONTROL_MUTATION_KEY } from "#thread/components/thread-control/hooks/use-thread-control.ts";

type ThreadControlProps = {
  threadId: string;
}

export const ThreadControl = ({ threadId }: ThreadControlProps) => {
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
