import { Button } from "@repo/ui/src/components/button.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { createPostAction } from "../models/create-post.model.ts";
import { postFormIsValidAtom } from "../models/post-form.model.ts";
import { IconCheck } from "@tabler/icons-react";

export const PostPublishButton = reatomComponent(({ ctx }) => {
  const isDisabled = !ctx.spy(postFormIsValidAtom) || ctx.spy(createPostAction.statusesAtom).isPending;

  return (
    <Button
      className="px-2 sm:px-4 bg-shark-50"
      disabled={isDisabled}
      onClick={() => createPostAction(ctx)}
    >
      <Typography className="hidden sm:inline text-shark-950 font-semibold text-base">
        Опубликовать
      </Typography>
      <IconCheck size={22} className="text-green-500 sm:hidden" />
    </Button>
  );
}, "PostPublishButton")