import { isParamChanged } from "#components/profile/main/models/requested-user.model";
import { threadParamAtom } from "#components/thread/models/thread.model";
import { atom, Ctx } from "@reatom/core";
import { withReset } from "@reatom/framework";

export type CreateThreadCommentType = "single" | "reply";

export type RepliedValuesType = {
  commentId: number;
  commentNickname: string;
  commentContent: string;
};

export const createThreadCommentThreadIdAtom = atom<string>("", "createThreadCommentThreadId").pipe(withReset())
export const createThreadCommentTypeAtom = atom<CreateThreadCommentType>("single", "createThreadCommentType").pipe(withReset())
export const createThreadCommentContentAtom = atom<string>("", "createThreadCommentContent").pipe(withReset())
export const createThreadCommentRepliedAtom = atom<RepliedValuesType | null>(null, "createThreadCommentReplied").pipe(withReset())

export function createThreadCommentReset(ctx: Ctx) {
  createThreadCommentTypeAtom.reset(ctx)
  createThreadCommentContentAtom.reset(ctx)
  createThreadCommentRepliedAtom.reset(ctx)
}

threadParamAtom.onChange((ctx, state) => {
  createThreadCommentThreadIdAtom(ctx, state)
})

threadParamAtom.onChange((ctx, state) => isParamChanged(ctx, threadParamAtom, state, () => {
  createThreadCommentReset(ctx)
  import.meta.env.DEV && console.log("createThreadCommentReset reset")
}))

createThreadCommentRepliedAtom.onChange((ctx, state) => {
  console.log("createThreadCommentRepliedAtom", state)
})
createThreadCommentThreadIdAtom.onChange((ctx, state) => {
  console.log("createThreadCommentThreadIdAtom", state)
})
createThreadCommentContentAtom.onChange((ctx, state) => {
  console.log("createThreadCommentContentAtom", state)
})
createThreadCommentTypeAtom.onChange((ctx, state) => {
  console.log("createThreadCommentTypeAtom", state)
})