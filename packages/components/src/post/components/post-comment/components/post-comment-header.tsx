import { Link } from "@tanstack/react-router";
import { PostCommentItemAdditional } from "./post-comment-additional.tsx";
import { UserNickname } from "#user/components/name/nickname.tsx";
import { PostCommentEntity } from "@repo/types/entities/entities-type.ts";
import { USER_URL } from "@repo/shared/constants/routes.ts";

type PostCommentItemHeader = Pick<
  PostCommentEntity,
  "user_nickname" | "id" | "post_id"
>;

export const PostCommentItemHeader = ({
  user_nickname,
  id: comment_id,
  post_id,
}: PostCommentItemHeader) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex flex-col w-fit grow">
        <Link to={USER_URL + user_nickname} className="w-fit">
          <UserNickname
            nickname={user_nickname}
            nicknameColor="#ffffff"
            className="text-sm"
          />
        </Link>
      </div>
      <div className="flex items-center w-fit">
        <PostCommentItemAdditional
          id={comment_id}
          user_nickname={user_nickname}
          post_id={post_id}
        />
      </div>
    </div>
  );
};
