import dayjs from 'dayjs';
import { Avatar } from '../../../../user/components/avatar/components/avatar.tsx';
import { UserNickname } from '../../../../user/components/name/components/nickname.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { ThreadAuthorBadge } from './thread-author-badge.tsx';
import { ThreadCommentActions } from './thread-comment-actions.tsx';
import { ThreadCommentProps } from '../types/thread-comment-types.ts';
import { ThreadRepliedCommentItem } from './thread-comment-replied-item.tsx';
import { BlockWrapper } from '../../../../wrappers/block-wrapper.tsx';
import { HoverCardWrapper } from '../../../../wrappers/hover-card-wrapper.tsx';
import { Ellipsis } from 'lucide-react';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { currentUserQuery } from '@repo/lib/queries/current-user-query.ts';

export const ThreadCommentItem = ({
  nickname, isAuthor, created_at, content,
  id, replied, thread_id,
}: ThreadCommentProps) => {
  
  const { data: currentUser } = currentUserQuery()
  
  if (!currentUser) return;
  
  const isOwner = currentUser.nickname === nickname;
  
  const createdAt = dayjs(
    created_at,
  ).format('DD.MM.YYYY HH:mm');
  
  return (
    <BlockWrapper
      id={id}
      backgroundColor="shark_black"
      className="flex flex-col gap-y-4 min-w-[450px] !w-fit"
    >
      <div className="flex items-center gap-2">
        <Avatar nickname={nickname} propWidth={48} propHeight={48} />
        <div className="flex justify-between w-full">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <UserNickname nickname={nickname} nicknameColor="" />
              {isAuthor && <ThreadAuthorBadge />}
            </div>
            <Typography className="text-shark-300 text-sm">
              {createdAt}
            </Typography>
          </div>
          {isOwner && (
            <div className="flex">
              <HoverCardWrapper
                properties={{ contentAlign: 'start', sideAlign: 'right', }}
                trigger={<Ellipsis size={22} className="text-shark-200 cursor-pointer" />}
                content={
                  <div className="flex flex-col gap-y-2">
                    <HoverCardItem>Удалить комментарий</HoverCardItem>
                    <HoverCardItem>Редактировать</HoverCardItem>
                  </div>
                }
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        {replied && <ThreadRepliedCommentItem replied={replied} />}
        <Typography>{content}</Typography>
      </div>
      <ThreadCommentActions
        thread_id={thread_id}
        comment_id={id}
        comment_nickname={nickname}
        comment_content={content}
      />
    </BlockWrapper>
  );
};