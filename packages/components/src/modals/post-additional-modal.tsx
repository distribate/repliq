import { DialogWrapper } from '../wrappers/dialog-wrapper.tsx';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { BlockWrapper } from '../wrappers/block-wrapper.tsx';
import Link from 'next/link';
import { Avatar } from '../user/components/avatar/components/avatar.tsx';
import { UserNickname } from '../user/components/name/components/nickname.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import dayjs from 'dayjs';
import { PostItemBody } from '../post/components/post-item/components/post-body/post-body.tsx';
import { Posts } from '../profile/components/posts/components/posts/queries/get-posts-by-user.ts';
import { PostControlProps } from '../post/components/post-item/components/post-header/post-control.tsx';

export const POST_ADDITIONAL_MODAL_NAME = (post_id: string) => `post-additional-${post_id}`

type PostAdditionalModal = PostControlProps & {
  post: Posts[],
}

export const PostAdditionalModal = ({
  post_id, post, name_color, nickname
}: PostAdditionalModal) => {
  return (
    <DialogWrapper
      properties={{ dialogContentClassName: "max-w-4xl !p-0" }}
      trigger={<HoverCardItem>Открыть в окне</HoverCardItem>}
      name={POST_ADDITIONAL_MODAL_NAME(post_id)}
    >
      <BlockWrapper className="flex flex-col gap-y-4">
        <div className="flex justify-between w-full items-center">
          <div className="flex gap-4 items-center">
            <Link href={`/user/${nickname}`}>
              <Avatar variant="page" propHeight={48} propWidth={48} nickname={nickname} />
            </Link>
            <div className="flex flex-col gap-y-1">
              <Link href={`/user/${nickname}`}>
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
    </DialogWrapper>
  )
}