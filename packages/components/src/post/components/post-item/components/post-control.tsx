import { Ellipsis } from 'lucide-react';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { useQueryClient } from '@tanstack/react-query';
import { POSTS_QUERY_KEY, PostsQueryPromise } from '#profile/components/posts/components/posts/queries/posts-query.ts';
import { DropdownWrapper } from '#wrappers/dropdown-wrapper.tsx';
import { PostAdditionalModal } from '#modals/custom/post-additional-modal.tsx';
import { UserEntity } from '@repo/types/entities/entities-type.ts';
import { useControlPost } from '#post/components/post-item/hooks/use-control-post.ts';
import { getUser } from '@repo/lib/helpers/get-user.ts';
import { ReportCreateModal } from '#modals/action-confirmation/components/report/components/report-create-modal.tsx';
import { ControlPost } from '#post/components/post-item/types/control-post-types.ts';
import { POST_CONTROL_QUERY_KEY, PostControlQuery } from '#post/components/post-item/queries/post-control-query.ts';
import { Typography } from '@repo/ui/src/components/typography.tsx';

export type PostControlProps = ControlPost & Pick<UserEntity, 'nickname'>

export const PostControl = ({
  id: postId, nickname,
}: PostControlProps) => {
  const qc = useQueryClient();
  const currentUser = getUser();
  const { controlPostMutation } = useControlPost();
  
  const posts = qc.getQueryData<PostsQueryPromise>(POSTS_QUERY_KEY(nickname));
  
  let post = posts
    ? posts?.data?.find(item => item.id === postId)
    : null;
  
  const handleRemovePost = () => {
    if (!post) return;
    return controlPostMutation.mutate({ type: 'remove', id: postId });
  };
  
  const handleComments = () => {
    if (!post) return;
    return controlPostMutation.mutate({ type: 'comments', isComments: post.isComments, id: postId });
  };
  
  const handleEditContent = () => {
    if (!post) return;
    return qc.setQueryData(POST_CONTROL_QUERY_KEY(postId), (prev: PostControlQuery) => ({
      ...prev, isEdit: true,
    }));
  };
  
  const handlePin = () => {
    if (!post) return;
    return controlPostMutation.mutate({ type: 'pin', isPinned: post.isPinned, id: postId });
  };
  
  if (!post || !currentUser) return;
  
  const isOwner = currentUser.nickname === nickname;
  const { isPinned, isComments } = post;
  
  return (
    <div className="w-fit">
      <DropdownWrapper
        properties={{ contentAlign: 'end', sideAlign: 'bottom' }}
        trigger={<Ellipsis size={22} className="text-shark-200 cursor-pointer" />}
        content={
          <div className="flex flex-col gap-y-2">
            {isOwner && (
              <>
                <HoverCardItem onClick={handleEditContent}>
                  <Typography>
                    Редактировать пост
                  </Typography>
                </HoverCardItem>
                <HoverCardItem onClick={handlePin}>
                  <Typography className={`${isPinned && 'text-caribbean-green-500'}`}>
                    {isPinned ? `Открепить пост` : `Закрепить пост`}
                  </Typography>
                </HoverCardItem>
                <HoverCardItem onClick={handleComments}>
                  <Typography className={`${isComments && 'text-caribbean-green-500'}`}>
                    {isComments ? `Выключить комментарии` : `Включить комментарии`}
                  </Typography>
                </HoverCardItem>
                <HoverCardItem onClick={handleRemovePost}>
                  <Typography>
                    Удалить пост
                  </Typography>
                </HoverCardItem>
                <Separator />
              </>
            )}
            {post && (
              <PostAdditionalModal post={post} nickname={nickname} />
            )}
            {!isOwner && (
              <ReportCreateModal
                targetId={postId}
                reportType="post"
                targetNickname={nickname}
              />
            )}
          </div>
        }
      />
    </div>
  );
};