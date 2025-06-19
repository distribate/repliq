import { Typography } from "@repo/ui/src/components/typography.tsx";
import { updateCreateThreadCommentAction } from "#components/thread/create-thread-comment/models/create-thread-comment.model";
import { RepliedValuesType } from "#components/thread/create-thread-comment/models/thread-comment.model";
import { ThreadDetailed } from "@repo/types/entities/thread-type.ts";
import { lazy, Suspense } from "react";
import { reatomComponent } from "@reatom/npm-react";

type ThreadCommentActionsProps = RepliedValuesType & Pick<ThreadDetailed, "id"> 
  & { isCommentOwner: boolean };

const ReportCreateModal = lazy(() =>
  import("#components/modals/action-confirmation/components/report/components/report-create-modal.tsx").then(m => ({ default: m.ReportCreateModal })),
);

export const ThreadCommentActions = reatomComponent<ThreadCommentActionsProps>(({
  ctx, commentId, commentNickname, commentContent, id: threadId, isCommentOwner,
}) => {
  const handle = () => {
    updateCreateThreadCommentAction(ctx, {
      type: "reply", replied: { commentId, commentNickname, commentContent },
    });
  }

  return (
    <div className="flex items-center gap-4">
      <Typography onClick={handle} className="text-shark-300 text-md cursor-pointer" >
        Ответить
      </Typography>
      {!isCommentOwner && (
        <Suspense>
          <ReportCreateModal targetId={commentId.toString()} type="comment" />
        </Suspense>
      )}
    </div>
  );
}, "ThreadCommentActions")