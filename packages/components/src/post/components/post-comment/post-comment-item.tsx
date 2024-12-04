import { Avatar } from "#user/components/avatar/components/avatar.tsx";
import Link from "next/link";
import { USER_URL } from "@repo/shared/constants/routes.ts";
import { PostCommentItemHeader } from "#post/components/post-comment/components/post-comment-header.tsx";
import { PostCommentItemFooter } from "#post/components/post-comment/components/post-comment-footer.tsx";
import { PostCommentBody } from "#post/components/post-comment/components/post-comment-body.tsx";
import { PostCommentEntity } from "@repo/types/entities/entities-type.ts";

export const PostCommentItem = ({
  content,
  id: comment_id,
  user_nickname,
  created_at,
  post_id,
}: PostCommentEntity) => {
  return (
    <div className="flex flex-row gap-2 group items-end justify-between w-full">
      <Link href={USER_URL + user_nickname}>
        <Avatar
          variant="page"
          propWidth={36}
          propHeight={36}
          nickname={user_nickname}
        />
      </Link>
      <div className="flex-col p-2 bg-shark-900 rounded-md gap-y-2 w-full">
        <PostCommentItemHeader
          id={comment_id}
          user_nickname={user_nickname}
          post_id={post_id}
        />
        <PostCommentBody content={content} />
        <PostCommentItemFooter
          post_id={post_id}
          created_at={created_at}
          user_nickname={user_nickname}
          id={comment_id}
        />
      </div>
    </div>
  );
};
