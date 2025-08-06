import { useEffect } from "react";
import { createThreadCommentAction, updateCreateThreadCommentAction } from "../models/create-thread-comment.model.ts";
import { Avatar } from "#components/user/avatar/components/avatar.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { SendHorizontal } from "lucide-react";
import { createThreadCommentAtom } from "../models/thread-comment.model.ts";
import { CreateThreadCommentLayout } from "./create-thread-comment-layout.tsx";
import { COMMENT_LIMIT } from "@repo/shared/constants/limits.ts";
import AutogrowingTextarea from "@repo/ui/src/components/autogrowing-textarea.tsx";
import { createThreadCommentSchema } from "../schemas/create-thread-comment-schema.ts";
import { reatomComponent } from "@reatom/npm-react";
import { getUser } from "#components/user/models/current-user.model.ts";
import { action, atom, sleep, withComputed, withConcurrency } from "@reatom/framework";
import { usePageContext } from "vike-react/usePageContext"

const onChange = action(async (ctx, e: React.ChangeEvent<HTMLTextAreaElement>) => {
  const { value } = e.target;

  await ctx.schedule(() => sleep(200))

  updateCreateThreadCommentAction(ctx, { content: value })
}).pipe(withConcurrency())

const textareaIsActiveAtom = atom(false, "textareaIsActive")
const isValidAtom = atom(false, "isValid").pipe(
  withComputed((_, state) => {
    const result = createThreadCommentSchema.safeParse(state)

    return result.success
  })
)

export const CreateThreadCommentForm = reatomComponent(({ ctx }) => {
  const paramId = usePageContext().routeParams.id

  const { nickname, avatar } = getUser(ctx);
  const createThreadCommentState = ctx.spy(createThreadCommentAtom)

  if (!paramId) return null;

  const onSubmit = async () => {
    if (!createThreadCommentState) return;

    createThreadCommentAction(ctx)
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };

  useEffect(() => {
    if (paramId) {
      updateCreateThreadCommentAction(ctx, { threadId: paramId });
    }
  }, [paramId]);

  const type = createThreadCommentState?.type || "single";

  return (
    <CreateThreadCommentLayout variant={type} state={ctx.spy(textareaIsActiveAtom) ? "active" : "none"}>
      <form onSubmit={onSubmit} className="flex items-start h-full w-full justify-between px-4 py-4">
        <Avatar
          url={avatar}
          className="self-start min-h-[36px] min-w-[36px]"
          propWidth={36}
          propHeight={36}
          nickname={nickname}
        />
        <div className="flex w-full items-start *:w-full h-fit">
          <AutogrowingTextarea
            id="thread-comment-content"
            placeholder="Напишите что-нибудь"
            className="flex w-full text-[16px] items-start resize-none min-h-[36px] max-h-[200px]"
            onFocus={() => textareaIsActiveAtom(ctx, false)}
            maxLength={COMMENT_LIMIT[1]}
            onBlur={() => textareaIsActiveAtom(ctx, true)}
            onChange={(e) => onChange(ctx, e)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <Button
          type="submit"
          variant="default"
          className="shadow-none bg-transparent border-none relative top-1 p-0 m-0"
          disabled={!ctx.spy(isValidAtom) || ctx.spy(createThreadCommentAction.statusesAtom).isPending}
        >
          <SendHorizontal
            size={26}
            className={ctx.spy(isValidAtom) ? "text-caribbean-green-500" : "text-shark-300"}
          />
        </Button>
      </form>
    </CreateThreadCommentLayout>
  );
}, "CreateThreadCommentForm")