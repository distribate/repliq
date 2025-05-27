import { Button } from "@repo/ui/src/components/button.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { createPostAction } from "../models/create-post.model.ts";
import { postFormIsValidAtom } from "../models/post-form.model.ts";

export const PostPublishButton = reatomComponent(({ ctx }) => {
  const isDisabled = !ctx.spy(postFormIsValidAtom) || ctx.spy(createPostAction.statusesAtom).isPending;

  return (
    <Button onClick={() => createPostAction(ctx)} variant="positive" disabled={isDisabled}>
      <Typography className="text-shark-50 text-base">
        Опубликовать
      </Typography>
    </Button>
  );
}, "PostPublishButton")