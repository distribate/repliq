import { MoreWrapper } from '#wrappers/more-wrapper.tsx';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { useControlThreadComment } from '../hooks/use-control-thread-comment.ts';
import { ThreadCommentEntity } from '@repo/types/entities/entities-type.ts';
import { useQueryClient } from '@tanstack/react-query';
import {
  COMMENT_ACTIONS_QUERY_KEY,
  CommentActionsQuery,
} from '#thread/components/thread-comment/queries/comment-actions-query.ts';

export const ThreadCommentMoreActions = ({
  id, thread_id
}: Pick<ThreadCommentEntity, 'id' | 'thread_id'>) => {
  const qc = useQueryClient();
  const { deleteCommentItemMutation } = useControlThreadComment();
  
  const handleEditContent = () => {
    return qc.setQueryData(COMMENT_ACTIONS_QUERY_KEY(id), (prev: CommentActionsQuery) => ({
      ...prev, isEdit: true
    }));
  };
  
  const handleDeleteContent = () => {
    return deleteCommentItemMutation.mutate({ thread_id, id });
  };
  
  return (
    <div className="absolute right-2 top-2">
      <MoreWrapper variant="small">
        <div className="flex flex-col gap-y-2">
          <HoverCardItem onClick={handleEditContent}>
            Редактировать
          </HoverCardItem>
          <HoverCardItem onClick={handleDeleteContent}>
            Удалить комментарий
          </HoverCardItem>
        </div>
      </MoreWrapper>
    </div>
  );
};