import { postFormContentAtom, postFormIsActiveAtom } from "../models/post-form.model.ts";
import { POST_CONTENT_LIMIT } from "@repo/shared/constants/limits.ts";
import AutogrowingTextarea from "@repo/ui/src/components/autogrowing-textarea.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { action } from "@reatom/core";
import { sleep, withConcurrency } from "@reatom/framework";

const onChange = action(async (ctx, e: React.ChangeEvent<HTMLTextAreaElement>) => {
  const { value } = e.target;
  await ctx.schedule(() => sleep(200))
  postFormContentAtom(ctx, value.length >= 1 ? value : null)
}).pipe(withConcurrency())

export const PostTextForm = reatomComponent(({ ctx }) => {
  return (
    <AutogrowingTextarea
      id="post-content"
      placeholder="Напишите что-нибудь"
      maxLength={POST_CONTENT_LIMIT[1]}
      className="text-[18px] !resize-none !px-2 mb-2 h-full"
      onClick={() => postFormIsActiveAtom(ctx, true)}
      onChange={e => onChange(ctx, e)}
    />
  );
}, "PostTextForm")