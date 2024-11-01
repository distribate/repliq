import { postCommentsQuery } from '../queries/posts-comments-query.ts';
import { PostComments as PostCommentsType } from '../queries/get-posts-comments.ts';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { PostCommentItem } from '#post/components/post-comment/post-comment-item.tsx';
import { PostCommentsSkeleton } from './post-comments-skeleton.tsx';

type PostCommentsProps = PostCommentsType & {
  commentsCount: number
}

export const PostComments = ({
  post_id, commentsCount
}: PostCommentsProps) => {
  const { data: postComments, isLoading } = postCommentsQuery({
    post_id, comments: commentsCount >= 1
  });
  
  if (isLoading) return <PostCommentsSkeleton />;
  if (postComments && !postComments.length) return null;
  
  return postComments?.length && (
    <>
      <Separator />
      <div className="flex flex-col gap-y-2 w-full">
        {postComments?.map(comment => (
          <PostCommentItem key={comment?.id} {...comment} post_id={post_id} />
        ))}
      </div>
    </>
  );
};