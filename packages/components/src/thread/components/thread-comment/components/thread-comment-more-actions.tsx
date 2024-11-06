import { MoreWrapper } from '#wrappers/more-wrapper.tsx';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { useControlThreadComment } from '../hooks/use-control-thread-comment.ts';
import { useState } from 'react';
import { Input } from '@repo/ui/src/components/input.tsx';
import { ThreadCommentEntity } from '@repo/types/entities/entities-type.ts';

export const ThreadCommentMoreActions = ({
  id, thread_id, content: currentContent
}: Pick<ThreadCommentEntity, "id" | "thread_id" | "content">) => {
  const [content, setContent] = useState<string>(currentContent || "");
  const { editCommentContentMutation, deleteCommentItemMutation } = useControlThreadComment();
  
  const handleEditContent = () => {
    if (content === currentContent) return;
    return editCommentContentMutation.mutate({ thread_id, id, content })
  }
  
  const handleDeleteContent = () => {
    return deleteCommentItemMutation.mutate({ thread_id, id })
  }
  
  return (
    <div className="absolute right-2 top-2">
      <MoreWrapper variant="small">
        <div className="flex flex-col gap-y-2">
          <Input
            value={content}
            onChange={e => setContent(e.target.value)}
          />
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