import { createThreadSchema, threadCategorySchema, threadContentSchema, threadTitleSchema } from "@repo/types/schemas/thread/create-thread-schema.ts";
import * as z from "zod";
import { Value } from "@udecode/plate";
import { action, atom, Ctx } from "@reatom/core";
import { reatomAsync, reatomMap, reatomResource, sleep, withCache, withConcurrency, withDataAtom, withReset, withStatusesAtom } from "@reatom/framework";
import { logger } from "@repo/lib/utils/logger";
import { serializeNodes } from "@repo/lib/helpers/nodes-serializer";
import { THREAD_TAGS_LIMIT } from "@repo/shared/constants/limits";
import { ChangeEvent } from "react";
import { THREAD_IMAGES_LIMIT_DEFAULT } from "@repo/shared/constants/limits";
import { currentUserAtom } from "#components/user/models/current-user.model";
import { forumCategoriesClient } from "#shared/forum-client";
import { FastAverageColor } from 'fast-average-color';

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

export const tagValueAtom = atom<string>("", "tagValue").pipe(withReset())

export const deleteTagAction = action((ctx, idx: number) => {
  const tags = ctx.get(threadFormTagsAtom)
  if (!tags) return;

  const updatedTags = tags.filter((_, i) => i !== idx);

  threadFormTagsAtom(ctx, updatedTags.length >= 1 ? updatedTags : null)
}, "deleteTagAction")

export const addTagAction = action((ctx) => {
  const tags = ctx.get(threadFormTagsAtom)

  if (tags && tags.length >= THREAD_TAGS_LIMIT[1]) return;

  const value = ctx.get(tagValueAtom)

  threadFormTagsAtom(ctx, (state) => {
    if (!state) state = []
    return [...state, value]
  })

  tagValueAtom.reset(ctx)
}, "addTagAction")

export const editThreadDescriptionOnChange = action(async (ctx, e: ChangeEvent<HTMLInputElement>) => {
  const { value } = e.target;
  await ctx.schedule(() => sleep(100))
  threadFormDescriptionAtom(ctx, value)
}, "editThreadDescriptionOnChange").pipe(withConcurrency())

export const editThreadTitleOnChange = action(async (ctx, e: ChangeEvent<HTMLInputElement>) => {
  const { value } = e.target;
  await ctx.schedule(() => sleep(100))
  threadFormTitleAtom(ctx, value)
}, "editThreadTitleOnChange").pipe(withConcurrency())

type CreateThreadImageControl =
  | { type: "add", images: Array<File> | null }
  | { type: "delete", index: number }

const fac = new FastAverageColor();

export const bgColorAtom = reatomMap<number, string>([]).pipe(withReset())

export const handleControlImagesAction = reatomAsync(async (ctx, values: CreateThreadImageControl) => {
  const images = ctx.get(threadFormImagesAtom)
  const type = values.type

  if (type === 'add') {
    if (!values.images) return;

    const newImageUrls = values.images.map(f => URL.createObjectURL(f));
    const updatedImages = images ? [...images, ...newImageUrls] : newImageUrls;

    for (let i = 0; i < newImageUrls.length; i++) {
      const absoluteIndex = images?.length ? images.length + i : i;
      const color = (await fac.getColorAsync(newImageUrls[i])).hex;
      bgColorAtom.set(ctx, absoluteIndex, color);
    }

    return threadFormImagesAtom(ctx, updatedImages)
  }

  if (type === 'delete') {
    const { index } = values;
    if (!images) return;

    const updatedImages = images.length <= 1
      ? null
      : images.filter((_, i) => i !== index);

    bgColorAtom.delete(ctx, index);

    const total = images.length;

    for (let i = index + 1; i < total; i++) {
      const color = bgColorAtom.get(ctx, i);

      if (color !== undefined) {
        bgColorAtom.set(ctx, i - 1, color);
        bgColorAtom.delete(ctx, i);
      }
    }

    return threadFormImagesAtom(ctx, updatedImages);
  }
}, "handleControlImagesAction")

export const handleAddImagesAction = action((ctx, e: React.ChangeEvent<HTMLInputElement>) => {
  const currentUser = ctx.get(currentUserAtom)
  if (!currentUser) return;

  const MAX_IMAGES = !currentUser.is_donate ? THREAD_IMAGES_LIMIT_DEFAULT[1] : 3;

  const images = e.target.files
    ? (Array.from(e.target.files).slice(THREAD_IMAGES_LIMIT_DEFAULT[0], MAX_IMAGES) as Array<File>)
    : null;

  e.preventDefault();

  return handleControlImagesAction(ctx, { type: "add", images });
}, "handleAddImagesAction")

export const handleDeleteImageAction = action((
  ctx,
  e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.ChangeEvent<HTMLInputElement>,
  idx: number
) => {
  e.preventDefault();
  return handleControlImagesAction(ctx, { index: idx, type: "delete" });
}, "handleDeleteImageAction")

export const availableCategoriesResource = reatomResource(async (ctx) => {
  return await ctx.schedule(async () => {
    const res = await forumCategoriesClient.categories["get-available-categories"].$get(
      {}, { init: { signal: ctx.controller.signal }}
    )

    const data = await res.json()
    
    if ('error' in data) throw new Error(data.error)
      
    return data.data
  })
}, "availableCategoriesResource").pipe(withDataAtom(), withStatusesAtom(), withCache())

threadFormTitleAtom.onChange((_, state) => import.meta.env.DEV && logger.info("threadFormTitleAtom", state))
threadFormContentAtom.onChange((_, state) => import.meta.env.DEV && logger.info("threadFormContentAtom", state))
threadFormDescriptionAtom.onChange((_, state) => import.meta.env.DEV && logger.info("threadFormDescriptionAtom", state))
threadFormImagesAtom.onChange((_, state) => import.meta.env.DEV && logger.info("threadFormImagesAtom", state))
threadFormVisibilityAtom.onChange((_, state) => import.meta.env.DEV && logger.info("threadFormVisibilityAtom", state))
threadFormTagsAtom.onChange((_, state) => import.meta.env.DEV && logger.info("threadFormTagsAtom", state))
threadFormCategoryAtom.onChange((_, state) => import.meta.env.DEV && logger.info("threadFormCategoryAtom", state))
threadFormIsCommentAtom.onChange((_, state) => import.meta.env.DEV && logger.info("threadFormIsCommentAtom", state))
threadFormPermissionAtom.onChange((_, state) => import.meta.env.DEV && logger.info("threadFormPermissionAtom", state))
threadFormStepAtom.onChange((_, state) => import.meta.env.DEV && logger.info("threadFormStepAtom", state))
threadFormTitleIsValidAtom.onChange((_, state) => import.meta.env.DEV && logger.info("threadFormTitleIsValidAtom", state))
threadFormCategoryIsValidAtom.onChange((_, state) => import.meta.env.DEV && logger.info("threadFormCategoryIsValidAtom", state))
threadFormContentIsValidAtom.onChange((_, state) => import.meta.env.DEV && logger.info("threadFormContentIsValidAtom", state))
threadFormIsValidAtom.onChange((_, state) => import.meta.env.DEV && logger.info("threadFormIsValidAtom", state))