import { Typography } from "@repo/ui/src/components/typography.tsx";
import { useCreateThreadComment } from "@repo/components/src/forms/create-thread-comment/hooks/use-create-thread-comment.tsx";
import { RepliedValuesType } from "@repo/components/src/forms/create-thread-comment/queries/create-thread-comment-query.ts";
import { ThreadModel } from "../../../queries/get-thread-model.ts";
import dynamic from "next/dynamic";

type ThreadCommentActionsProps = RepliedValuesType &
  Pick<ThreadModel, "id"> & {
    isCommentOwner: boolean;
  };

const ReportCreateModal = dynamic(() =>
  import(
    "@repo/components/src/modals/action-confirmation/components/report/components/report-create-modal.tsx"
  ).then((m) => m.ReportCreateModal),
);

export const ThreadCommentActions = ({
  commentId,
  commentNickname,
  commentContent,
  id: threadId,
  isCommentOwner,
}: ThreadCommentActionsProps) => {
  const { updateCreateThreadCommentMutation } = useCreateThreadComment();

  const handleReplyComment = () => {
    return updateCreateThreadCommentMutation.mutate({
      type: "reply",
      repliedValues: { commentId, commentNickname, commentContent },
    });
  };

  return (
    <div className="flex items-center gap-4">
      <Typography
        className="text-shark-300 text-md cursor-pointer"
        onClick={handleReplyComment}
      >
        Ответить
      </Typography>
      {!isCommentOwner && (
        <ReportCreateModal
          reportType="comment"
          threadId={threadId}
          targetNickname={commentNickname}
          targetId={commentId}
        />
      )}
    </div>
  );
};
