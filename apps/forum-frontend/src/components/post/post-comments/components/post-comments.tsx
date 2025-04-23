import { Separator } from "@repo/ui/src/components/separator.tsx";
import { PostEntity } from "@repo/types/entities/entities-type.ts";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { BlockWrapper } from "#components/wrappers/components/block-wrapper";
import { postCommentsQuery } from "#components/post/post-comments/queries/post-comments-query.ts";

type PostCommentsProps = Pick<PostEntity, "id"> & {
  comments_count: number;
};

const PostCommentSkeleton = () => {
  return (
    <div className="flex flex-row gap-2 group items-end justify-between w-full">
      <Skeleton className="h-[36px] w-[36px]" />
      <BlockWrapper className="flex-col gap-y-2 w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col w-fit grow">
            <Skeleton className="h-6 w-36" />
          </div>
        </div>
        <div className="flex w-full mb-4">
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
      </BlockWrapper>
    </div>
  );
};

const PostCommentsSkeleton = () => {
  return (
    <>
      <Separator />
      <div className="flex flex-col gap-y-2 w-full">
        <PostCommentSkeleton />
        <PostCommentSkeleton />
      </div>
    </>
  );
};

export const PostComments = ({
  id: postId,
  comments_count,
}: PostCommentsProps) => {
  const { data: postComments, isLoading } = postCommentsQuery({
    id: postId,
    comments: comments_count >= 1,
  });

  if (isLoading) return <PostCommentsSkeleton />;

  if (!postComments || (postComments && !postComments.length)) return null;

  return (
    <>
      <Separator />
      <div className="flex flex-col gap-y-2 w-full">
        {/* {postComments.map((comment) => (
          <PostCommentItem
            key={comment.id}
            post_id={comment.post_id}
            created_at={comment.created_at}
            user_nickname={comment.user_nickname}
            content={comment.content}
            id={comment.id}
          />
        ))} */}
      </div>
    </>
  );
};
