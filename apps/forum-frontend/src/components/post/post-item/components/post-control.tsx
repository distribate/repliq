import { Ellipsis, Pen, Pin, Trash } from "lucide-react";
import { HoverCardItem } from "@repo/ui/src/components/hover-card.tsx";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { DropdownWrapper } from "#components/wrappers/components/dropdown-wrapper";
import { PostAdditionalModal } from "#components/post/post-item/components/post-additional-modal";
import { PostEntity, UserEntity } from "@repo/types/entities/entities-type.ts";
import { controlPostAction } from "#components/post/post-item/models/control-post.model";
import { currentUserNicknameAtom } from "@repo/lib/helpers/get-user.ts";
import { ReportCreateModal } from "#components/modals/action-confirmation/components/report/components/report-create-modal.tsx";
import {
  editPostsControlAtom,
} from "#components/post/post-item/models/post-control.model";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Cloud } from "lucide-react";
import { reatomComponent } from "@reatom/npm-react";
import { postsDataAtom } from "#components/profile/posts/models/posts.model";

export type PostControlProps = Pick<PostEntity, "id" | "isComments"> & Pick<UserEntity, "nickname">;

export const PostControl = reatomComponent<PostControlProps>(({ ctx, id, nickname, isComments }) => {
  const currentUserNickname = ctx.spy(currentUserNicknameAtom)

  const posts = ctx.spy(postsDataAtom)
  if (!posts) return null;

  let post = posts.find(target => target.id === id);
  if (!post) return null;

  const { isPinned } = post;

  const handleRemovePost = () => controlPostAction(ctx, { type: "delete", id, nickname });
  const handlePin = () => controlPostAction(ctx, { type: "pin", id, nickname });
  const handleComments = () => controlPostAction(ctx, { type: "comments", id, nickname });

  const handleEditContent = () => {
    editPostsControlAtom(ctx, id, { isEdit: true, content: "" })
  };

  const isOwner = currentUserNickname === nickname;
  const pinnedPost = posts.find(p => p.isPinned) && !isPinned || false;

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
              nickname={post.nickname}
            />
            {isOwner && (
              <>
                <Separator />
                <HoverCardItem className="gap-2 items-center" onClick={handleEditContent} >
                  <Pen size={16} className="text-shark-300" />
                  <Typography>Редактировать пост</Typography>
                </HoverCardItem>
                <HoverCardItem
                  className={`gap-2 items-center ${pinnedPost ? "select-none opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
                  onClick={handlePin}
                >
                  <Pin size={16} className="text-shark-300" />
                  <Typography state={isPinned ? "active" : "default"}>
                    {isPinned ? `Открепить пост` : `Закрепить пост`}
                  </Typography>
                </HoverCardItem>
                <HoverCardItem className="gap-2 items-center" onClick={handleComments}>
                  <Cloud size={16} className="text-shark-300" />
                  <Typography state={isComments ? 'active' : 'default'}>
                    {isComments ? `Выключить комментарии` : `Включить комментарии`}
                  </Typography>
                </HoverCardItem>
                <HoverCardItem className="gap-2 items-center" onClick={handleRemovePost} >
                  <Trash size={16} className="text-shark-300" />
                  <Typography>Удалить пост</Typography>
                </HoverCardItem>
              </>
            )}
            {!isOwner && (
              <>
                <Separator />
                <ReportCreateModal
                  targetId={id}
                  reportType="post"
                  targetNickname={nickname}
                />
              </>
            )}
          </div>
        }
      />
    </div>
  );
}, "PostControl")