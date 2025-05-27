import { Button } from "@repo/ui/src/components/button.tsx";
import { ThreadControlMain } from "./thread-control-main.tsx";
import { PencilLine } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { DynamicModal } from "#components/modals/dynamic-modal/components/dynamic-modal.tsx";
import { threadAtom } from "#components/thread/thread-main/models/thread.model.ts";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { isAuthenticatedAtom } from "@repo/lib/queries/global-option-query.ts";

export const ThreadControl = reatomComponent(({ ctx }) => {
  const isAuthenticated = ctx.spy(isAuthenticatedAtom)
  if (!isAuthenticated) return null;

  const thread= ctx.spy(threadAtom)
  const currentUser = getUser(ctx)

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
          content={<ThreadControlMain threadId={thread.id} />}
        />
      </div>
      <Separator />
    </>
  );
}, "ThreadControl")