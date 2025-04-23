import { Button } from "@repo/ui/src/components/button.tsx";
import { ThreadControlMain } from "./thread-control-main.tsx";
import { PencilLine } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { DynamicModal } from "#components/modals/dynamic-modal/components/dynamic-modal.tsx";
import { THREAD_CONTROL_MUTATION_KEY } from "#components/thread/thread-control/hooks/use-thread-control.ts";
import { useQueryClient } from "@tanstack/react-query";
import { ThreadDetailed } from "@repo/types/entities/thread-type.ts";
import { THREAD_QUERY_KEY } from "#components/thread/thread-main/queries/thread-query.ts";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { Separator } from "@repo/ui/src/components/separator.tsx";

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
    <>
      <div className="flex flex-col justify-center w-full h-full border-2 rounded-lg p-4 border-shark-800">
        <div className="flex flex-col">
          <Typography>
            Добавьте изображения
          </Typography>
        </div>
        <DynamicModal
          mutationKey={THREAD_CONTROL_MUTATION_KEY}
          contentClassName="max-w-4xl pb-4"
          trigger={
            <Button className="w-full" state="default">
              <div className="flex items-center gap-2">
                <PencilLine size={20} />
                <Typography textSize="medium">
                  Редактировать тред
                </Typography>
              </div>
            </Button>
          }
          content={<ThreadControlMain threadId={threadId} />}
        />
      </div>
      <Separator />
    </>
  );
};
