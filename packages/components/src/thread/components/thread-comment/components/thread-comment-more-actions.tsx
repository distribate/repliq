import { MoreWrapper } from '../../../../wrappers/more-wrapper.tsx';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { useControlThreadComment } from '../hooks/use-control-thread-comment.ts';
import { useState } from 'react';
import { EditThreadCommentContent } from '../queries/edit-thread-comment-content.ts';
import { Input } from '@repo/ui/src/components/input.tsx';

export const ThreadCommentMoreActions = ({
  commentId, threadId, content: currentContent
}: EditThreadCommentContent) => {
  const [content, setContent] = useState<string>(currentContent || "");
  const { editCommentContentMutation, deleteCommentItemMutation } = useControlThreadComment();
  
  const handleEditContent = () => {
    if (content === currentContent) return;
    
    editCommentContentMutation.mutate({
      threadId, commentId, content
    })
  }
  
  const handleDeleteContent = () => {
    deleteCommentItemMutation.mutate({
      threadId, commentId
    })
  }
  
  return (
    <div className="absolute right-2 top-2">
      <MoreWrapper variant="small">
        <div className="flex flex-col gap-y-2">
          <Input value={content} onChange={e => setContent(e.target.value)} />
          <HoverCardItem
            onClick={handleEditContent}
          >
            Редактировать
          </HoverCardItem>
          <HoverCardItem
            onClick={handleDeleteContent}
          >
            Удалить комментарий
          </HoverCardItem>
        </div>
      </MoreWrapper>
    </div>
  );
};