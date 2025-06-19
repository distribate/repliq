import { Reply } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { createThreadCommentAtom } from "#components/thread/create-thread-comment/models/thread-comment.model";
import { CloseButton } from "@repo/ui/src/components/close-button.tsx";
import { updateCreateThreadCommentAction } from "#components/thread/create-thread-comment/models/create-thread-comment.model";
import { reatomComponent } from "@reatom/npm-react";

export const ReplyComment = reatomComponent(({ ctx }) => {
  const createThreadCommentState = ctx.spy(createThreadCommentAtom)
  const values = createThreadCommentState?.replied;

  if (createThreadCommentState?.type === "single" || !values) return null;

  const { commentNickname, commentContent } = values;

  const handle = () => {
    updateCreateThreadCommentAction(ctx, {
      type: "single",
      replied: null,
    });
  }

  return (
    <div className="flex relative items-center gap-4 rounded-t-md bg-secondary-color px-4 py-2 w-full">
      <Reply size={26} />
      <div className="flex flex-col items-start">
        <Typography textSize="small">Ответить {commentNickname}</Typography>
        <div className="flex max-w-[120px]">
          <Typography className="text-shark-300 truncate">
            {commentContent}
          </Typography>
        </div>
      </div>
      <CloseButton variant="center" onClick={handle} />
    </div>
  );
}, "ReplyComment")