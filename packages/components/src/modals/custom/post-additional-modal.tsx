import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import Link from 'next/link';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import dayjs from 'dayjs';
import { PostControlProps } from '#post/components/post-item/components/post-header/post-control.tsx';
import { BlockWrapper } from '#wrappers/block-wrapper.tsx';
import { Avatar } from '#user/components/avatar/components/avatar.tsx';
import { UserNickname } from '#user/components/name/components/nickname.tsx';
import { PostItemBody } from '#post/components/post-item/components/post-body/post-body.tsx';
import { Dialog, DialogContent, DialogTrigger } from '@repo/ui/src/components/dialog.tsx';
import { USER_URL } from '@repo/shared/constants/routes.ts';
import { PostEntity } from '@repo/types/entities/entities-type.ts';

type PostAdditionalModal = PostControlProps & {
  post: PostEntity[],
}

export const PostAdditionalModal = ({
  id, post, name_color, nickname,
}: PostAdditionalModal) => {
  return (
    <Dialog>
      <DialogTrigger>
        <HoverCardItem>Открыть в окне</HoverCardItem>
      </DialogTrigger>
      <DialogContent id={id} className="max-w-4xl !p-0">
        <BlockWrapper className="flex flex-col gap-y-4">
          <div className="flex justify-between w-full items-center">
            <div className="flex gap-4 items-center">
              <Link href={USER_URL + nickname}>
                <Avatar variant="page" propHeight={48} propWidth={48} nickname={nickname} />
              </Link>
              <div className="flex flex-col gap-y-1">
                <Link href={USER_URL + nickname}>
                  <UserNickname nickname={nickname} nicknameColor={name_color} className="text-base font-medium" />
                </Link>
                <Typography className="text-shark-200 text-sm">
                  {dayjs(post[0].created_at).format('DD.MM.YYYY HH:mm')}
                </Typography>
              </div>
            </div>
          </div>
          <PostItemBody content={post[0].content} />
        </BlockWrapper>
      </DialogContent>
    </Dialog>
  );
};