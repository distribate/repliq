import {
  CREATE_THREAD_COMMENT_QUERY_KEY,
  createThreadCommentQuery,
} from "#forms/create-thread-comment/queries/create-thread-comment-query.ts";
import { ReplyComment } from "./reply-comment.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { CreateThreadCommentForm } from "@repo/components/src/forms/create-thread-comment/components/create-thread-comment-form.tsx";
import { useEffect } from "react";

export const CreateThreadComment = () => {
  const qc = useQueryClient();
  const { data: createThreadCommentState } = createThreadCommentQuery();

  const type = createThreadCommentState?.type ?? "single";

  useEffect(() => {
    qc.resetQueries({ queryKey: CREATE_THREAD_COMMENT_QUERY_KEY }).then();
  }, []);

  return (
    <div className="flex flex-col w-full">
      {type === "reply" && <ReplyComment />}
      <CreateThreadCommentForm />
    </div>
  );
};