import { createThreadSchema, threadCategorySchema, threadContentSchema, threadTitleSchema } from "@repo/types/schemas/thread/create-thread-schema.ts";
import { z } from "zod/v4";
import { Value } from "@udecode/plate";
import { atom, Ctx } from "@reatom/core";
import { withReset } from "@reatom/framework";
import { logger } from "@repo/lib/utils/logger";
import { serializeNodes } from "@repo/lib/helpers/nodes-serializer";

type ThreadForm = Omit<z.infer<typeof createThreadSchema>,
  | "content" | "images" | "category_id" | "tags" | "visibility"
> & {
  content: Value
  images: string[] | null
  tags: string[] | null
  visibility: "all" | "friends"
  category_id: number | null
};

export const threadFormTitleAtom = atom<ThreadForm["title"]>("", "threadFormTitle").pipe(withReset())
export const threadFormContentAtom = atom<ThreadForm["content"]>([], "threadFormContent").pipe(withReset())
export const threadFormDescriptionAtom = atom<ThreadForm["description"]>(null, "threadFormDescription").pipe(withReset())
export const threadFormImagesAtom = atom<ThreadForm["images"]>(null, "threadFormImages").pipe(withReset())
export const threadFormVisibilityAtom = atom<ThreadForm["visibility"]>("all", "threadFormVisibility").pipe(withReset())
export const threadFormTagsAtom = atom<ThreadForm["tags"]>(null, "threadFormTags").pipe(withReset())
export const threadFormCategoryAtom = atom<ThreadForm["category_id"]>(null, "threadFormCategory").pipe(withReset())
export const threadFormIsCommentAtom = atom(true, "threadFormIsCommentAtom").pipe(withReset())
export const threadFormPermissionAtom = atom(false, "threadFormPermission").pipe(withReset())

export const threadFormTitleIsValidAtom = atom(false, "threadFormTitleIsValidAtom").pipe(withReset())
export const threadFormCategoryIsValidAtom = atom(false, "threadFormCategoryIsValidAtom").pipe(withReset())
export const threadFormContentIsValidAtom = atom(false, "threadFormContentIsValidAtom").pipe(withReset())
export const formStepsConfig = [
  {
    id: "title",
    isValidAtom: threadFormTitleIsValidAtom,
  },
  {
    id: "category",
    isValidAtom: threadFormCategoryIsValidAtom,
  },
  {
    id: "content",
    isValidAtom: threadFormContentIsValidAtom,
  },
] as const;

export type FormStepId = typeof formStepsConfig[number]['id'];

export const threadFormStepAtom = atom<FormStepId | 'done'>((ctx) => {
  for (const step of formStepsConfig) {
    const isStepValid = ctx.spy(step.isValidAtom);

    if (!isStepValid) {
      return step.id;
    }
  }

  return "done";
}).pipe(withReset());

export const threadFormIsValidAtom = atom((ctx) => ctx.spy(threadFormStepAtom) === 'done').pipe(withReset());

threadFormTitleAtom.onChange((ctx, target) => {
  threadFormTitleIsValidAtom(ctx, threadTitleSchema.safeParse(target).success)
})

threadFormCategoryAtom.onChange((ctx, target) => {
  threadFormCategoryIsValidAtom(ctx, threadCategorySchema.safeParse(target).success)
})

threadFormContentAtom.onChange((ctx, target) => {
  threadFormContentIsValidAtom(ctx, threadContentSchema.safeParse(serializeNodes(target)).success)
})

threadFormTitleAtom.onChange((_, state) => logger.info("threadFormTitleAtom", state))
threadFormContentAtom.onChange((_, state) => logger.info("threadFormContentAtom", state))
threadFormDescriptionAtom.onChange((_, state) => logger.info("threadFormDescriptionAtom", state))
threadFormImagesAtom.onChange((_, state) => logger.info("threadFormImagesAtom", state))
threadFormVisibilityAtom.onChange((_, state) => logger.info("threadFormVisibilityAtom", state))
threadFormTagsAtom.onChange((_, state) => logger.info("threadFormTagsAtom", state))
threadFormCategoryAtom.onChange((_, state) => logger.info("threadFormCategoryAtom", state))
threadFormIsCommentAtom.onChange((_, state) => logger.info("threadFormIsCommentAtom", state))
threadFormPermissionAtom.onChange((_, state) => logger.info("threadFormPermissionAtom", state))

threadFormStepAtom.onChange((_, state) => logger.info("threadFormStepAtom", state))

threadFormTitleIsValidAtom.onChange((_, state) => logger.info("threadFormTitleIsValidAtom", state))
threadFormCategoryIsValidAtom.onChange((_, state) => logger.info("threadFormCategoryIsValidAtom", state))
threadFormContentIsValidAtom.onChange((_, state) => logger.info("threadFormContentIsValidAtom", state))
threadFormIsValidAtom.onChange((_, state) => logger.info("threadFormIsValidAtom", state))

export function createThreadFormReset(ctx: Ctx) {
  threadFormTitleAtom.reset(ctx)
  threadFormContentAtom.reset(ctx)
  threadFormDescriptionAtom.reset(ctx)
  threadFormImagesAtom.reset(ctx)
  threadFormVisibilityAtom.reset(ctx)
  threadFormTagsAtom.reset(ctx)
  threadFormCategoryAtom.reset(ctx)
  threadFormIsCommentAtom.reset(ctx)
  threadFormPermissionAtom.reset(ctx)

  threadFormStepAtom.reset(ctx)

  threadFormTitleIsValidAtom.reset(ctx)
  threadFormCategoryIsValidAtom.reset(ctx)
  threadFormContentIsValidAtom.reset(ctx)
  threadFormIsValidAtom.reset(ctx)
}