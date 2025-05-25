import {
  createThreadCommentAtom,
} from "#components/forms/create-thread-comment/queries/create-thread-comment-query.ts";
import { ReplyComment } from "./reply-comment.tsx";
import { CreateThreadCommentForm } from "#components/forms/create-thread-comment/components/create-thread-comment-form.tsx";
import { useEffect } from "react";
import { reatomComponent } from "@reatom/npm-react";

export const CreateThreadComment = reatomComponent(({ ctx }) => {
  const type = ctx.spy(createThreadCommentAtom)?.type ?? "single"

  useEffect(() => {
    createThreadCommentAtom.reset(ctx)
  }, []);

  return (
    <div className="flex flex-col w-full">
      {type === "reply" && <ReplyComment />}
      <CreateThreadCommentForm />
    </div>
  );
}, "CreateThreadComment")