import { Typography } from "@repo/ui/src/components/typography.tsx";
import { useState } from "react";
import AutogrowingTextarea from "@repo/ui/src/components/autogrowing-textarea.tsx";
import { getCommentActionsAtom } from "../models/comment-actions.model";
import { ThreadRepliedCommentItem } from "./thread-comment-replied-item";
import { ThreadCommentProps } from "../types/thread-comment-types";
import { reatomComponent } from "@reatom/npm-react";

type ThreadCommentItemContentProps = Pick<
  ThreadCommentProps, "content" | "replied" | "id" | "threadId" | "isOwner"
>

export const ThreadCommentItemContent = reatomComponent<ThreadCommentItemContentProps>(({
  ctx, content: currentContent, replied, id, threadId,
}) => {
  const commentState = getCommentActionsAtom(ctx, id)
  const [content, setContent] = useState<string>(currentContent || "");

  return (
    <div className="flex flex-col gap-y-2 h-fit w-full">
      {replied && <ThreadRepliedCommentItem replied={replied} threadId={threadId} />}
      {commentState?.isEdit ? (
        <AutogrowingTextarea
          className="p-0 text-[16px] bg-none max-h-[600px]"
          placeholder="Напишите что-нибудь"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      ) : (
        <div className="whitespace-normal break-words">
          <Typography className="text-balance">{content}</Typography>
        </div>
      )}
    </div>
  );
}, "ThreadCommentItemContent")