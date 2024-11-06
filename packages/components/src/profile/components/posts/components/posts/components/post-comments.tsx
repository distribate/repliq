import { postCommentsQuery } from '../queries/posts-comments-query.ts';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { PostCommentItem } from '#post/components/post-comment/post-comment-item.tsx';
import { PostCommentsSkeleton } from './post-comments-skeleton.tsx';
import { PostEntity } from '@repo/types/entities/entities-type.ts';

type PostCommentsProps = Pick<PostEntity, "id"> & {
  commentsCount: number
}

export const PostComments = ({
  id, commentsCount
}: PostCommentsProps) => {
  const { data: postComments, isLoading } = postCommentsQuery({
    id, comments: commentsCount >= 1
  });
  
  if (isLoading) return <PostCommentsSkeleton />;
  
  if (!postComments
    || (postComments && !postComments.length)
  ) return null;
  
  return (
    <>
      <Separator />
      <div className="flex flex-col gap-y-2 w-full">
        {postComments.map(comment => (
          <PostCommentItem
            key={comment.id}
            post_id={comment.post_id}
            created_at={comment.created_at}
            user_nickname={comment.user_nickname}
            content={comment.content}
            id={comment.id}
          />
        ))}
      </div>
    </>
  );
};