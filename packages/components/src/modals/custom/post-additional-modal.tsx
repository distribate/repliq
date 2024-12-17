import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { BlockWrapper } from '#wrappers/block-wrapper.tsx';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@repo/ui/src/components/dialog.tsx';
import { PostItemBody } from '#post/components/post-item/components/post-body.tsx';
import { Square } from 'lucide-react';
import { PostItemHeader } from '#post/components/post-item/components/post-header.tsx';
import type { UserPostItem } from '@repo/types/routes-types/get-user-posts-types.ts';

type PostAdditionalModalProps = Pick<UserPostItem,
  | "id"
  | "user_nickname"
  | "created_at"
  | "visibility"
  | "isPinned"
  | "content"
>

export const PostAdditionalModal = ({
  isPinned, content, user_nickname, created_at, visibility, id
}: PostAdditionalModalProps) => {
  return (
    <Dialog>
      <DialogTrigger>
        <HoverCardItem className="gap-2 items-center">
          <Square size={16} className="text-shark-300" />
          <Typography>Открыть в окне</Typography>
        </HoverCardItem>
      </DialogTrigger>
      <DialogContent id={id} className="max-w-4xl !p-0">
        <BlockWrapper className="flex flex-col gap-y-4">
          <div className="flex justify-between w-full items-center">
            <PostItemHeader
              user_nickname={user_nickname}
              created_at={created_at}
              visibility={visibility}
              isPinned={isPinned}
            />
          </div>
          <PostItemBody id={id} content={content} user_nickname={user_nickname} />
        </BlockWrapper>
      </DialogContent>
    </Dialog>
  );
};