import { Typography } from "@repo/ui/src/components/typography.tsx";
import { useCreateThreadComment } from "#components/forms/create-thread-comment/hooks/use-create-thread-comment.tsx";
import { RepliedValuesType } from "#components/forms/create-thread-comment/queries/create-thread-comment-query.ts";
import { ThreadDetailed } from "@repo/types/entities/thread-type.ts";
import { lazy, Suspense } from "react";

type ThreadCommentActionsProps = RepliedValuesType &
  Pick<ThreadDetailed, "id"> & {
    isCommentOwner: boolean;
  };

const ReportCreateModal = lazy(() =>
  import(
    "#components/modals/action-confirmation/components/report/components/report-create-modal.tsx"
  ).then((m) => ({ default: m.ReportCreateModal })),
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
      replied: { commentId, commentNickname, commentContent },
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
        <Suspense>
          <ReportCreateModal
            reportType="comment"
            threadId={threadId}
            targetNickname={commentNickname}
            targetId={commentId}
          />
        </Suspense>
      )}
    </div>
  );
};