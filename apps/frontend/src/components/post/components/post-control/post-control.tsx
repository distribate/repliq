import { MoreVertical, Pen, Pin, Trash } from "lucide-react";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { currentUserNicknameAtom } from "#components/user/models/current-user.model.ts";
import { ReportCreateModal } from "#components/modals/with-confirm/report/components/report-create-modal";
import { editPostsControlAtom } from "#components/post/models/post-control.model";
import { Cloud } from "lucide-react";
import { reatomComponent } from "@reatom/npm-react";
import { postsDataAtom } from "#components/profile/components/posts/models/posts.model";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu";
import { moreVariant } from "#ui/more-wrapper";
import { deletePostAction, disablePostCommentsAction, pinPostAction } from "../../models/control-post.model";
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@repo/ui/src/components/dialog.tsx';
import { PostItemBody } from '#components/post/components/post-body/post-body';
import { Square } from 'lucide-react';
import { PostItemHeader } from '#components/post/components/post-head/post-head';
import type { UserPostItem } from '@repo/types/routes-types/get-user-posts-types.ts';
import { UserDetailed } from '@repo/types/entities/user-type';

type PostAdditionalModalProps = Pick<UserPostItem,
  | "id" | "nickname" | "created_at" | "visibility" | "isPinned" | "content"
> & Pick<UserDetailed, "avatar">

const PostAdditionalModal = ({
  isPinned, content, nickname, created_at, visibility, id, avatar
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
        <div className="flex bg-primary-color rounded-lg px-4 py-2 flex-col gap-y-4">
          <div className="flex justify-between w-full items-center">
            <PostItemHeader
              avatar={avatar}
              nickname={nickname}
              created_at={created_at}
              visibility={visibility}
              isPinned={isPinned}
            />
          </div>
          <PostItemBody id={id} content={content} nickname={nickname} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

type PostControlProps = {
  id: string,
  nickname: string
}

export const PostControl = reatomComponent<PostControlProps>(({ ctx, id, nickname }) => {
  const currentUserNickname = ctx.spy(currentUserNicknameAtom)
  const isOwner = currentUserNickname === nickname;

  const posts = ctx.spy(postsDataAtom)
  if (!posts) return null;

  let post = posts.find(target => target.id === id);
  if (!post) return null;

  const { isPinned, isComments } = post

  const handleRemovePost = () => deletePostAction(ctx, { id, nickname });
  const handlePin = () => pinPostAction(ctx, { id, nickname, currentState: isPinned });
  const handleComments = () => disablePostCommentsAction(ctx, { id, nickname });
  const handleEditContent = () => editPostsControlAtom(ctx, id, { isEdit: true, content: post.content })

  const pinnedPost = posts.find(p => p.isPinned) && !isPinned || false;

  return (
    <div className="w-fit">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <div className={moreVariant({ size: "med" })}>
            <MoreVertical size={20} className="text-shark-300" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <div className="flex flex-col gap-y-2">
            <PostAdditionalModal
              id={post.id}
              avatar={post.avatar}
              content={post.content}
              created_at={post.created_at}
              visibility={post.visibility}
              isPinned={post.isPinned}
              nickname={post.nickname}
            />
            {isOwner && (
              <>
                <Separator />
                <DropdownMenuItem className="gap-2 items-center" onClick={handleEditContent} >
                  <Pen size={16} className="text-shark-300" />
                  <Typography>Редактировать пост</Typography>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={`gap-2 items-center ${pinnedPost ? "select-none opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
                  onClick={handlePin}
                >
                  <Pin size={16} className="text-shark-300" />
                  <Typography state={isPinned ? "active" : "default"}>
                    {isPinned ? `Открепить пост` : `Закрепить пост`}
                  </Typography>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 items-center" onClick={handleComments}>
                  <Cloud size={16} className="text-shark-300" />
                  <Typography state={isComments ? 'active' : 'default'}>
                    {isComments ? `Выключить комментарии` : `Включить комментарии`}
                  </Typography>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 items-center" onClick={handleRemovePost} >
                  <Trash size={16} className="text-shark-300" />
                  <Typography>Удалить пост</Typography>
                </DropdownMenuItem>
              </>
            )}
            {!isOwner && (
              <>
                <Separator />
                <ReportCreateModal targetId={id} type="post" />
              </>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}, "PostControl")