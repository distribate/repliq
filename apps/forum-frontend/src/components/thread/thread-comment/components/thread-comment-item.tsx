import dayjs from "@repo/lib/constants/dayjs-instance.ts";
import { Avatar } from "#components/user/avatar/components/avatar.tsx";
import { UserNickname } from "#components/user/name/nickname.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { ThreadCommentActions } from "./thread-comment-actions.tsx";
import { ThreadCommentProps } from "../types/thread-comment-types.ts";
import { Badge } from "@repo/ui/src/components/badge.tsx";
import { currentUserAtom } from "#components/user/models/current-user.model.ts";
import { lazy, Suspense } from "react";
import { ThreadCommentItemContent } from "./thread-comment-item-content.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { highlightActiveAtom, selectedCommentAtom } from "../models/scroll-to-replied.model.ts";
import { CustomLink } from "#components/shared/link.tsx";
import { createIdLink } from "@repo/lib/utils/create-link.ts";

const ThreadCommentMoreActions = lazy(() =>
  import("./thread-comment-more-actions.tsx").then(m => ({ default: m.ThreadCommentMoreActions })),
);

export const ThreadCommentItem = reatomComponent<ThreadCommentProps & { idx: number }>(({
  user, isOwner, ctx, created_at, content, id, replied, threadId, is_updated, idx
}) => {
  const currentUser = ctx.spy(currentUserAtom)
  const { nickname, avatar } = user
  const isCommentOwner = currentUser?.nickname === nickname;

  const isActive = ctx.spy(highlightActiveAtom) && ctx.spy(selectedCommentAtom) === id

  return (
    <div
      id={idx.toString()}
      data-state={isActive ? "active" : "inactive"}
      className="data-[state=active]:animate-flash-fade
       flex flex-col h-fit gap-y-4 px-4 py-2 rounded-md bg-shark-950 relative min-w-[450px] w-fit max-w-[80%]"
    >
      {isCommentOwner && (
        <Suspense>
          <ThreadCommentMoreActions id={id} />
        </Suspense>
      )}
      <div className="flex items-center gap-2">
        <CustomLink to={createIdLink("user", nickname)}>
          <Avatar url={avatar} nickname={nickname} propWidth={42} propHeight={42} className="min-h-[42px] min-w-[42px]" />
        </CustomLink>
        <div className="flex justify-between w-full">
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <UserNickname nickname={nickname} />
              {isOwner && (
                <Badge size="small">
                  <Typography className="leading-4">автор</Typography>
                </Badge>
              )}
            </div>
            <Typography className="text-shark-300 text-sm">
              {dayjs(created_at).fromNow()}
            </Typography>
          </div>
        </div>
      </div>
      <ThreadCommentItemContent
        content={content} replied={replied} isOwner={isCommentOwner} id={id} threadId={threadId}
      />
      <div className="flex items-center justify-between w-full">
        <ThreadCommentActions isCommentOwner={isCommentOwner} commentId={id} commentNickname={nickname} commentContent={content} />
        {is_updated && (
          <Typography textColor="gray" textSize="small">
            [изменено]
          </Typography>
        )}
      </div>
    </div>
  );
}, "ThreadCommentItem")