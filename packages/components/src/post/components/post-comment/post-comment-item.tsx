import { PostCommentItemHeader } from './components/post-comment-header/post-comment-header.tsx';
import { PostCommentBody } from './components/post-comment-body/post-comment-body.tsx';
import { PostCommentItemFooter } from './components/post-comment-footer/post-comment-footer.tsx';
import { Avatar } from '../../../user/components/avatar/components/avatar.tsx';
import { CommentItemProps } from './types/post-comment-types.ts';
import Link from 'next/link';

export const PostCommentItem = ({
  content, id: comment_id, user_nickname, created_at, post_id
}: CommentItemProps) => {
  
  if (!comment_id) return;
  
  return (
    <div className="flex flex-row gap-2 group items-end justify-between w-full">
      <Link href={`/user/${user_nickname}`}>
        <Avatar variant="page" propWidth={36} propHeight={36} nickname={user_nickname} />
      </Link>
      <div className="flex-col p-2 border-[1px] border-white/10 bg-shark-900 rounded-lg gap-y-2 w-full">
        <PostCommentItemHeader id={comment_id} user_nickname={user_nickname} post_id={post_id} />
        <PostCommentBody content={content} />
        <PostCommentItemFooter post_id={post_id} created_at={created_at} user_nickname={user_nickname} id={comment_id} />
      </div>
    </div>
  );
};