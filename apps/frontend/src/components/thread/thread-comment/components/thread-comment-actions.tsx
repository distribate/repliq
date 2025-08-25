import { Typography } from "@repo/ui/src/components/typography.tsx";
import { createThreadCommentRepliedAtom, createThreadCommentTypeAtom, RepliedValuesType } from "#components/thread/create-thread-comment/models/thread-comment.model";
import { reatomComponent } from "@reatom/npm-react";
import { clientOnly } from "vike-react/clientOnly";

type ThreadCommentActionsProps = RepliedValuesType & { isCommentOwner: boolean };

const ReportCreateModal = clientOnly(() =>
  import("#components/modals/action-confirmation/components/report/components/report-create-modal.tsx").then(m => m.ReportCreateModal),
);

export const ThreadCommentActions = reatomComponent<ThreadCommentActionsProps>(({
  ctx, commentId, commentNickname, commentContent, isCommentOwner,
}) => {
  const handle = () => {
    createThreadCommentTypeAtom(ctx, "reply")
    createThreadCommentRepliedAtom(ctx, { commentId, commentNickname, commentContent })
  }

  return (
    <div className="flex items-center gap-4">
      <Typography onClick={handle} className="text-shark-300 text-md cursor-pointer" >
        Ответить
      </Typography>
      {!isCommentOwner && (
        <ReportCreateModal targetId={commentId.toString()} type="comment" />
      )}
    </div>
  );
}, "ThreadCommentActions")