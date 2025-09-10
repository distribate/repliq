import dayjs from "@repo/shared/constants/dayjs-instance.ts";
import { Avatar } from "#components/user/components/avatar/components/avatar.tsx";
import { UserNickname } from "#components/user/components/name/nickname.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { ThreadCommentActions } from "./thread-comment-actions.tsx";
import { ThreadCommentProps } from "../types/thread-comment-types.ts";
import { currentUserAtom } from "#components/user/models/current-user.model.ts";
import { ThreadCommentItemContent } from "./thread-comment-item-content.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { highlightActiveAtom, selectedCommentAtom } from "../models/scroll-to-replied.model.ts";
import { CustomLink } from "#shared/components/link.tsx";
import { createIdLink } from "#shared/helpers/create-link.ts";
import { clientOnly } from "vike-react/clientOnly";

const ThreadCommentMoreActions = clientOnly(() =>
  import("./thread-comment-more-actions.tsx").then(m => m.ThreadCommentMoreActions),
);

export const ThreadCommentItem = reatomComponent<ThreadCommentProps & { idx: number }>(({
  user, isOwner: isThreadOwner, ctx, created_at, content, id, replied, threadId, is_updated, idx
}) => {
  const { nickname, avatar } = user;
  const currentUser = ctx.spy(currentUserAtom)

  const isCommentOwner = currentUser?.nickname === nickname;
  const isActive = ctx.spy(highlightActiveAtom) && ctx.spy(selectedCommentAtom) === id

  return (
    <div
      id={idx.toString()}
      data-state={isActive ? "active" : "inactive"}
      className="data-[state=active]:animate-flash-fade
       flex flex-col h-fit gap-4 p-2 sm:p-4 rounded-lg bg-shark-900/60 relative w-full sm:min-w-[450px] sm:w-fit sm:max-w-[80%]"
    >
      {isCommentOwner && (
        <ThreadCommentMoreActions id={id} />
      )}
      <div className="flex items-center gap-2">
        <CustomLink to={createIdLink("user", nickname)} className="min-h-12 h-12 max-h-12 aspect-square">
          <Avatar
            url={avatar}
            nickname={nickname}
            propWidth={48}
            propHeight={48}
            className="min-h-12 h-12 max-h-12 aspect-square"
          />
        </CustomLink>
        <div className="flex justify-between w-full">
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <UserNickname nickname={nickname} />
              {isThreadOwner && (
                <div className="flex select-none items-center justify-center rounded-xl px-2 h-6 bg-shark-50">
                  <Typography className="relative -top-0.5 font-semibold text-shark-950 text-sm">
                    автор
                  </Typography>
                </div>
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
        <ThreadCommentActions
          isCommentOwner={isCommentOwner}
          commentId={id}
          commentNickname={nickname}
          commentContent={content}
        />
        {is_updated && (
          <Typography textColor="gray" textSize="small">
            [изменено]
          </Typography>
        )}
      </div>
    </div>
  );
}, "ThreadCommentItem")