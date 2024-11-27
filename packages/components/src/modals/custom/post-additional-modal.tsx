import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { BlockWrapper } from '#wrappers/block-wrapper.tsx';
import { Dialog, DialogContent, DialogTrigger } from '@repo/ui/src/components/dialog.tsx';
import { UserEntity } from '@repo/types/entities/entities-type.ts';
import { PostItemBody } from '#post/components/post-item/components/post-body.tsx';
import { OverridedPosts } from '#profile/components/posts/components/posts/queries/get-posts.ts';
import { Square } from 'lucide-react';
import { PostItemHeader } from '#post/components/post-item/components/post-header.tsx';

type PostAdditionalModal = Pick<UserEntity, 'nickname'> & {
  post: OverridedPosts
}

export const PostAdditionalModal = ({
  post, nickname
}: PostAdditionalModal) => {
  const { created_at, isPinned, visibility } = post;
  
  return (
    <Dialog>
      <DialogTrigger>
        <HoverCardItem className="gap-2 items-center">
          <Square size={16} className="text-shark-300"/>
          <Typography>Открыть в окне</Typography>
        </HoverCardItem>
      </DialogTrigger>
      <DialogContent id={post.id} className="max-w-4xl !p-0">
        <BlockWrapper className="flex flex-col gap-y-4">
          <div className="flex justify-between w-full items-center">
            <PostItemHeader
              nickname={nickname}
              created_at={created_at}
              visibility={visibility}
              isPinned={isPinned}
            />
          </div>
          <PostItemBody id={post.id} content={post.content} nickname={nickname} />
        </BlockWrapper>
      </DialogContent>
    </Dialog>
  );
};