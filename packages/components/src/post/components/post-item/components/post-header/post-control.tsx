import { Ellipsis } from 'lucide-react';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { useControlPost } from '../../hooks/use-control-post.ts';
import { useQueryClient } from '@tanstack/react-query';
import { POSTS_QUERY_KEY, } from '#profile/components/posts/components/posts/queries/posts-query.ts';
import { DropdownWrapper } from '#wrappers/dropdown-wrapper.tsx';
import { PostAdditionalModal } from '#modals/custom/post-additional-modal.tsx';
import { PostEntity, UserEntity } from '@repo/types/entities/entities-type.ts';

export type PostControlProps = Pick<PostEntity, "id"> & Pick<UserEntity,  "nickname" | "name_color">

export const PostControl = ({
  id, nickname, name_color
}: PostControlProps) => {
  const qc = useQueryClient();
  const { controlPostMutation } = useControlPost();
  
  const posts = qc.getQueryData<PostEntity[]>(POSTS_QUERY_KEY(nickname));
  const post = posts?.filter(item => item.id === id);
  
  const handleRemovePost = () => {
    return controlPostMutation.mutate({ type: 'remove', id, nickname, })
  }
  
  return (
    <div className="w-fit">
      <DropdownWrapper
        properties={{ contentAlign: 'end', sideAlign: 'bottom' }}
        trigger={<Ellipsis size={22} className="text-shark-200 cursor-pointer" />}
        content={
          <div className="flex flex-col gap-y-2">
            <HoverCardItem onClick={handleRemovePost}>
              Удалить пост
            </HoverCardItem>
            <HoverCardItem>Редактировать пост</HoverCardItem>
            <HoverCardItem>Закрепить пост</HoverCardItem>
            <HoverCardItem>Выключить комментарии</HoverCardItem>
            <Separator />
            {post && (
              <PostAdditionalModal
                id={id}
                post={post}
                nickname={nickname}
                name_color={name_color}
              />
            )}
          </div>
        }
      />
    </div>
  );
};