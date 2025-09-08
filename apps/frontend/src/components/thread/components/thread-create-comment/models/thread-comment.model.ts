import { isParamChanged } from "#components/profile/main/models/requested-user.model";
import { threadParamAtom } from "#components/thread/models/thread.model";
import { log } from "#lib/utils";
import { atom, batch, Ctx } from "@reatom/core";
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
  batch(ctx, () => {
    createThreadCommentTypeAtom.reset(ctx)
    createThreadCommentContentAtom.reset(ctx)
    createThreadCommentRepliedAtom.reset(ctx)
  })
}

threadParamAtom.onChange((ctx, state) => {
  createThreadCommentThreadIdAtom(ctx, state)
})

threadParamAtom.onChange((ctx, state) => isParamChanged(ctx, threadParamAtom, state, () => {
  createThreadCommentReset(ctx)
  log("createThreadCommentReset reset")
}))

createThreadCommentRepliedAtom.onChange((_, v) => log("createThreadCommentRepliedAtom", v))
createThreadCommentThreadIdAtom.onChange((_, v) => log("createThreadCommentThreadIdAtom", v))
createThreadCommentContentAtom.onChange((_, v) => log("createThreadCommentContentAtom", v))
createThreadCommentTypeAtom.onChange((_, v) => log("createThreadCommentTypeAtom", v))