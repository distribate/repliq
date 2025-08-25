import {
  createThreadCommentTypeAtom,
} from "#components/thread/create-thread-comment/models/thread-comment.model.ts";
import { ReplyComment } from "./reply-comment.tsx";
import { CreateThreadCommentForm } from "#components/thread/create-thread-comment/components/create-thread-comment-form.tsx";
import { reatomComponent } from "@reatom/npm-react";

export const CreateThreadComment = reatomComponent(({ ctx }) => {
  const type = ctx.spy(createThreadCommentTypeAtom)

  return (
    <div className="flex flex-col w-full">
      {type === "reply" && <ReplyComment />}
      <CreateThreadCommentForm />
    </div>
  );
}, "CreateThreadComment")