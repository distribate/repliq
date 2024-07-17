import { HoverCardWrapper } from '../../../../../wrappers/hover-card-wrapper.tsx';
import { Ellipsis } from 'lucide-react';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { useControlPost } from '../../hooks/use-control-post.ts';
import { useQueryClient } from '@tanstack/react-query';
import { DialogWrapper } from '../../../../../wrappers/dialog-wrapper.tsx';
import { PostItemBody } from '../post-body/post-body.tsx';
import { BlockWrapper } from '../../../../../wrappers/block-wrapper.tsx';
import { POSTS_QUERY_KEY, } from '../../../../../profile/components/posts/components/posts/queries/posts-query.ts';
import { Posts } from '../../../../../profile/components/posts/components/posts/queries/get-posts-by-user.ts';
import Link from 'next/link';
import { Avatar } from '../../../../../user/components/avatar/components/avatar.tsx';
import { UserNickname } from '../../../../../user/components/name/components/nickname.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import dayjs from 'dayjs';

type PostControlProps = {
  post_id: string,
  nickname: string,
  name_color: string
}

export const PostControl = ({
  post_id, nickname, name_color
}: PostControlProps) => {
  const { controlPostMutation } = useControlPost();
  
  const qc = useQueryClient();
  
  const posts = qc.getQueryData<Posts[]>(POSTS_QUERY_KEY(nickname))
  const post = posts?.filter(item => item.post_id === post_id);
  
  return (
    <div className="flex">
      <HoverCardWrapper
        properties={{ contentAlign: 'end', sideAlign: 'bottom' }}
        trigger={<Ellipsis size={22} className="text-shark-200 cursor-pointer" />}
        content={
          <div className="flex flex-col gap-y-2">
            <HoverCardItem
              onClick={(e) => {
                controlPostMutation.mutate({ type: 'remove', post_id, nickname, });
              }}
            >
              Удалить пост
            </HoverCardItem>
            <HoverCardItem>Редактировать пост</HoverCardItem>
            <HoverCardItem>Закрепить пост</HoverCardItem>
            <HoverCardItem>Выключить комментарии</HoverCardItem>
            <Separator />
            {post && (
              <DialogWrapper
                properties={{ dialogContentClassName: "max-w-4xl !p-0" }}
                trigger={<HoverCardItem>Открыть в окне</HoverCardItem>}
                name={`Post ${post_id}`}
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
            )}
          </div>
        }
      />
    </div>
  );
};