import { Button } from "@repo/ui/src/components/button.tsx";
import { postFormFieldAtom } from "../models/post-form.model.ts";
import { POST_CONTENT_LIMIT } from "@repo/shared/constants/limits.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { createPostAction } from "../models/create-post.model.ts";

export const PostPublishButton = reatomComponent(({ ctx }) => {
  const { content, visibility } = ctx.spy(postFormFieldAtom)

  const formFieldLength = content?.length ?? 0;
  const isDisabled = formFieldLength <= POST_CONTENT_LIMIT[0] || ctx.spy(createPostAction.statusesAtom).isPending;

  return (
    <Button onClick={() => createPostAction(ctx, { content, visibility })} variant="positive" disabled={isDisabled}>
      <Typography className="text-shark-50 text-base">
        Опубликовать
      </Typography>
    </Button>
  );
}, "PostPublishButton")