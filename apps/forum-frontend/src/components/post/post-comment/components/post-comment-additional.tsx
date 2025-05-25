import { Ellipsis } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { HoverCardItem } from "@repo/ui/src/components/hover-card.tsx";
import { DropdownWrapper } from "#components/wrappers/components/dropdown-wrapper";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import React from "react";
import { PostCommentEntity } from "@repo/types/entities/entities-type.ts";
import { controlCommentAction } from "#components/post/post-comment/hooks/use-control-comment.ts";
import { reatomComponent } from "@reatom/npm-react";

type PostCommentItemAdditional = Pick<PostCommentEntity, "id" | "user_nickname" | "post_id">;

export const PostCommentItemAdditional = reatomComponent<PostCommentItemAdditional>(({
  ctx, id, user_nickname, post_id,
}) => {
  const { nickname } = getUser(ctx);

  const isOwner = nickname === user_nickname;

  const handleRemoveComment = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    return controlCommentAction(ctx, { type: "remove", post_id });
  };

  return (
    <DropdownWrapper
      properties={{ sideAlign: "left", contentAlign: "start" }}
      trigger={<Ellipsis size={18} className="text-shark-300 cursor-pointer" />}
      content={
        <div className="flex flex-col gap-y-2 w-full">
          {isOwner && (
            <>
              <HoverCardItem onClick={handleRemoveComment}>
                <Typography
                  textShadow="small"
                  className="text-sm font-medium text-shark-50 cursor-pointer"
                >
                  Удалить комментарий
                </Typography>
              </HoverCardItem>
              <Separator />
            </>
          )}
          <HoverCardItem>
            <Typography
              textShadow="small"
              className="text-sm font-medium text-red-500 cursor-pointer"
            >
              Пожаловаться
            </Typography>
          </HoverCardItem>
        </div>
      }
    />
  );
}, "PostCommentItemAdditional")