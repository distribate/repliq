import { action, atom } from "@reatom/core";
import { withReset } from "@reatom/framework";
import { z } from "zod";
import { POST_CONTENT_LIMIT } from "@repo/shared/constants/limits.ts";

export type VisibilityPost = "only" | "all" | "friends";

export const POST_VISIBILITY_INITIAL: VisibilityPost = "all"

export const postFormVisibilityAtom = atom<VisibilityPost>(POST_VISIBILITY_INITIAL, "postFormVisibility").pipe(withReset())
export const postFormContentAtom = atom<string | null>(null, "postFormContent").pipe(withReset())
export const postFormIsActiveAtom = atom(false, "postFormIsActive").pipe(withReset())
export const postFormIsValidAtom = atom(false, "postFormIsValid").pipe(withReset())

export const postContentSchema = z.string().min(POST_CONTENT_LIMIT[0]).max(POST_CONTENT_LIMIT[1]);

postFormContentAtom.onChange((ctx, state) => {
  postFormIsValidAtom(ctx, postContentSchema.safeParse(state).success)
})

export const postFormResetAction = action((ctx) => {
  postFormContentAtom.reset(ctx)
  postFormIsActiveAtom.reset(ctx)
  postFormVisibilityAtom.reset(ctx)
  postFormIsValidAtom.reset(ctx)
}, "postFormResetAction")