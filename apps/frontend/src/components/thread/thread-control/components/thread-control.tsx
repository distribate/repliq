import { Button } from "@repo/ui/src/components/button.tsx";
import { PencilLine } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { threadIsEditableAtom, threadParamAtom } from "#components/thread/models/thread.model";
import { reatomComponent } from "@reatom/npm-react";
import { CustomLink } from "#shared/components/link";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { isAuthenticatedAtom } from "#components/auth/models/auth.model";

export const ThreadControl = reatomComponent(({ ctx }) => {
  const isAuthenticated = ctx.spy(isAuthenticatedAtom)
  if (!isAuthenticated) return null;

  const threadIsEditable = ctx.spy(threadIsEditableAtom)
  if (!threadIsEditable) return null;

  const threadId = ctx.spy(threadParamAtom)

  const link = `/studio?type=threads&target=${threadId}`

  return (
    <>
      <CustomLink to={link}>
        <Button className="w-full bg-white">
          <div className="flex items-center gap-2 invert">
            <PencilLine size={16} />
            <Typography textSize="medium">
              Редактировать тред
            </Typography>
          </div>
        </Button>
      </CustomLink>
      <Separator orientation="vertical" />
    </>
  );
}, "ThreadControl")