import { MoreWrapper } from "#wrappers/more-wrapper.tsx";
import { useControlThreadComment } from "../hooks/use-control-thread-comment.ts";
import { useQueryClient } from "@tanstack/react-query";
import {
  COMMENT_ACTIONS_QUERY_KEY,
  CommentActionsQuery,
} from "#thread/components/thread-comment/queries/comment-actions-query.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Pen, Trash } from "lucide-react";
import { DropdownMenuItem } from "@repo/ui/src/components/dropdown-menu.tsx";

export const ThreadCommentMoreActions = ({ id: commentId, thread_id }: { id: number, thread_id: string }) => {
  const qc = useQueryClient();
  // const { deleteCommentItemMutation } = useControlThreadComment();

  const handleEditContent = () => {
    return qc.setQueryData(
      COMMENT_ACTIONS_QUERY_KEY(commentId),
      (prev: CommentActionsQuery) => ({ ...prev, isEdit: true }),
    );
  };

  const handleDeleteContent = async () => {
    await qc.resetQueries({ queryKey: COMMENT_ACTIONS_QUERY_KEY(commentId) });
    // return deleteCommentItemMutation.mutate({ thread_id, id: commentId });
  };

  return (
    <div className="absolute right-2 top-2">
      <MoreWrapper variant="small" background="transparent">
        <div className="flex flex-col gap-y-2">
          <DropdownMenuItem
            className="items-center gap-2"
            onClick={handleEditContent}
          >
            <Pen size={16} className="text-shark-300" />
            <Typography>Редактировать</Typography>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="items-center gap-2"
            onClick={handleDeleteContent}
          >
            <Trash size={16} className="text-shark-300" />
            <Typography>Удалить комментарий</Typography>
          </DropdownMenuItem>
        </div>
      </MoreWrapper>
    </div>
  );
};
