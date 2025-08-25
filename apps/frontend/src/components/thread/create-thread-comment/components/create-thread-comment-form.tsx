import { createThreadCommentAction, isValidAtom, textareaIsActiveAtom } from "../models/create-thread-comment.model.ts";
import { Avatar } from "#components/user/components/avatar/components/avatar.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { SendHorizontal } from "lucide-react";
import { createThreadCommentContentAtom, createThreadCommentTypeAtom } from "../models/thread-comment.model.ts";
import { COMMENT_LIMIT } from "@repo/shared/constants/limits.ts";
import AutogrowingTextarea from "@repo/ui/src/components/autogrowing-textarea.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { getUser } from "#components/user/models/current-user.model.ts";
import { cva } from "class-variance-authority";
import { threadParamAtom } from "#components/thread/models/thread.model.ts";

const createThreadCommentFormVariants = cva(
  "flex flex-col border-2 focus-visible:border-green-500/40 bg-shark-900/60 overflow-hidden w-full h-full",
  {
    variants: {
      variant: {
        single: "rounded-lg border-2",
        reply: "rounded-b-lg border-2",
      },
      state: {
        active: "border-green-500/20",
        none: "border-transparent",
      },
    },
    defaultVariants: {
      variant: "single",
      state: "none"
    },
  },
);

const CreateThreadCommentFormAvatar = reatomComponent(({ ctx }) => {
  const { nickname, avatar } = getUser(ctx);

  return (
    <Avatar
      url={avatar}
      className="self-start h-12 max-h-12 min-h-12 aspect-square"
      propWidth={48}
      propHeight={48}
      nickname={nickname}
    />
  )
}, "CreateThreadFormAvatar")

const CreateThreadCommentFormContent = reatomComponent(({ ctx }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      createThreadCommentAction(ctx)
    }
  };

  return (
    <AutogrowingTextarea
      id="thread-comment-content"
      placeholder="Напишите что-нибудь"
      className="flex w-full text-base items-start h-full p-0 resize-none min-h-[36px] max-h-[260px]"
      maxLength={COMMENT_LIMIT[1]}
      value={ctx.spy(createThreadCommentContentAtom)}
      onKeyDown={handleKeyDown}
      onFocus={() => textareaIsActiveAtom(ctx, true)}
      onBlur={() => textareaIsActiveAtom(ctx, false)}
      onChange={(e) => createThreadCommentContentAtom(ctx, e.target.value)}
    />
  )
}, "CreateThreadCommentFormContent")

export const CreateThreadCommentForm = reatomComponent(({ ctx }) => {
  const id = ctx.get(threadParamAtom)
  if (!id) return null;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    createThreadCommentAction(ctx)
  }

  const isDisabled = !ctx.spy(isValidAtom) || ctx.spy(createThreadCommentAction.statusesAtom).isPending
  const variant = ctx.spy(createThreadCommentTypeAtom)
  const state = ctx.spy(textareaIsActiveAtom) ? "active" : "none"

  return (
    <div className={createThreadCommentFormVariants({ variant, state })}>
      <form
        onSubmit={onSubmit}
        className="flex items-center h-full gap-2 w-full justify-between p-2 sm:p-4"
      >
        <CreateThreadCommentFormAvatar />
        <CreateThreadCommentFormContent />
        <Button
          type="submit"
          variant="default"
          className="hover:bg-shark-800 bg-shark-900 aspect-square p-2"
          disabled={isDisabled}
        >
          <SendHorizontal
            size={26}
            className={ctx.spy(isValidAtom) ? "text-green-500" : "text-shark-300"}
          />
        </Button>
      </form>
    </div>
  );
}, "CreateThreadCommentForm")