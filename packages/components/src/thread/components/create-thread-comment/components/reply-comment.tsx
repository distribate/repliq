import { Reply } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { createThreadCommentQuery } from "#forms/create-thread-comment/queries/create-thread-comment-query.ts";
import { CloseButton } from "@repo/ui/src/components/close-button.tsx";
import { useCreateThreadComment } from "#forms/create-thread-comment/hooks/use-create-thread-comment.tsx";

export const ReplyComment = () => {
  const { data: createThreadCommentState } = createThreadCommentQuery();
  const { updateCreateThreadCommentMutation } = useCreateThreadComment();
  const values = createThreadCommentState?.repliedValues;

  if (createThreadCommentState.type === "single" || !values) return null;

  const { commentNickname, commentContent } = values;

  const handleCommentType = () => {
    return updateCreateThreadCommentMutation.mutate({
      type: "single",
      repliedValues: null,
    });
  };

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
      <CloseButton variant="center" onClick={handleCommentType} />
    </div>
  );
};
