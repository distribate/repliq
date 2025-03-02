import { ThreadRepliedCommentItem } from "#components/thread/components/thread-comment/components/thread-comment-replied-item.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { ThreadCommentProps } from "#components/thread/components/thread-comment/types/thread-comment-types.ts";
import { useQueryClient } from "@tanstack/react-query";
import { commentActionsQuery } from "#components/thread/components/thread-comment/queries/comment-actions-query.ts";
import { useControlThreadComment } from "#components/thread/components/thread-comment/hooks/use-control-thread-comment.ts";
import { useState } from "react";
import AutogrowingTextarea from "@repo/ui/src/components/autogrowing-textarea.tsx";

type ThreadCommentItemContentProps = Pick<
  ThreadCommentProps,
  "content" | "replied" | "id" | "thread_id"
> & {
  isOwner: boolean;
};

export const ThreadCommentItemContent = ({
  content: currentContent,
  replied,
  id,
  isOwner,
  thread_id,
}: ThreadCommentItemContentProps) => {
  const qc = useQueryClient();
  const data = commentActionsQuery(isOwner ? id : null);
  // const { editCommentContentMutation } = useControlThreadComment();
  const [content, setContent] = useState<string>(currentContent || "");

  const commentState = data?.data;

  const handleSave = () => {
    if (content === currentContent) return;
    // return editCommentContentMutation.mutate({ thread_id, id, content });
  };

  return (
    <div className="flex flex-col gap-y-2 h-fit w-full">
      {replied && <ThreadRepliedCommentItem replied={replied} threadId={thread_id} />}
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
};