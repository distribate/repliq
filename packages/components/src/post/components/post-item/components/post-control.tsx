import { Ellipsis, Pen, Pin, Trash } from "lucide-react";
import { HoverCardItem } from "@repo/ui/src/components/hover-card.tsx";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { useQueryClient } from "@tanstack/react-query";
import {
  POSTS_QUERY_KEY,
  PostsQueryResponse,
} from "#profile/components/posts/components/posts/queries/posts-query.ts";
import { DropdownWrapper } from "#wrappers/dropdown-wrapper.tsx";
import { PostAdditionalModal } from "#modals/custom/post-additional-modal.tsx";
import { PostEntity, UserEntity } from "@repo/types/entities/entities-type.ts";
import { useControlPost } from "#post/components/post-item/hooks/use-control-post.ts";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { ReportCreateModal } from "#modals/action-confirmation/components/report/components/report-create-modal.tsx";
import {
  POST_CONTROL_QUERY_KEY,
  PostControlQuery,
} from "#post/components/post-item/queries/post-control-query.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";

export type PostControlProps = Pick<PostEntity, "id"> &
  Pick<UserEntity, "nickname">;

// const handleComments = () => controlPostMutation.mutate({ type: 'comments', isComments, id: postId });

export const PostControl = ({ id, nickname }: PostControlProps) => {
  const qc = useQueryClient();
  const { nickname: currentUserNickname } = getUser();
  const { controlPostMutation } = useControlPost();

  const posts = qc.getQueryData<PostsQueryResponse>(POSTS_QUERY_KEY(nickname))?.data;
  if (!posts) return null;

  let post = posts.find((post) => post.id === id);
  if (!post) return null;
  
  const { isPinned } = post;

  const handleRemovePost = () => controlPostMutation.mutate({ type: "remove", id, nickname });
  const handlePin = () => controlPostMutation.mutate({ type: "pin", id, nickname });

  const handleEditContent = () => {
    return qc.setQueryData(POST_CONTROL_QUERY_KEY(id),
      (prev: PostControlQuery) => ({ ...prev, isEdit: true }),
    );
  };

  const isOwner = currentUserNickname === nickname;

  return (
    <div className="w-fit">
      <DropdownWrapper
        properties={{ contentAlign: "end", sideAlign: "bottom" }}
        trigger={
          <Ellipsis size={22} className="text-shark-200 cursor-pointer" />
        }
        content={
          <div className="flex flex-col gap-y-2">
            <PostAdditionalModal
              id={post.id}
              content={post.content}
              created_at={post.created_at}
              visibility={post.visibility}
              isPinned={post.isPinned}
              user_nickname={post.user_nickname}
            />
            <Separator />
            {isOwner && (
              <>
                <HoverCardItem
                  className="gap-2 items-center"
                  onClick={handleEditContent}
                >
                  <Pen size={16} className="text-shark-300" />
                  <Typography>Редактировать пост</Typography>
                </HoverCardItem>
                <HoverCardItem
                  className="gap-2 items-center"
                  onClick={handlePin}
                >
                  <Pin size={16} className="text-shark-300" />
                  <Typography state={isPinned ? "active" : "default"}>
                    {isPinned ? `Открепить пост` : `Закрепить пост`}
                  </Typography>
                </HoverCardItem>
                {/*<HoverCardItem onClick={handleComments}>*/}
                {/*  <Typography state={isComments ? 'active' : 'default'}>*/}
                {/*    {isComments ? `Выключить комментарии` : `Включить комментарии`}*/}
                {/*  </Typography>*/}
                {/*</HoverCardItem>*/}
                <HoverCardItem
                  className="gap-2 items-center"
                  onClick={handleRemovePost}
                >
                  <Trash size={16} className="text-shark-300" />
                  <Typography>Удалить пост</Typography>
                </HoverCardItem>
                <Separator />
              </>
            )}
            {!isOwner && (
              <ReportCreateModal
                targetId={id}
                reportType="post"
                targetNickname={nickname}
              />
            )}
          </div>
        }
      />
    </div>
  );
};
