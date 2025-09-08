import * as z from "zod";
import { createThreadSchema, threadCategorySchema, threadContentSchema, threadTitleSchema } from "@repo/types/schemas/thread/create-thread-schema.ts";
import { Value } from "@udecode/plate";
import { action, atom, batch, Ctx } from "@reatom/core";
import { reatomAsync, reatomMap, sleep, withCache, withConcurrency, withDataAtom, withReset, withStatusesAtom } from "@reatom/framework";
import { THREAD_TAGS_LIMIT } from "@repo/shared/constants/limits";
import { ChangeEvent } from "react";
import { THREAD_IMAGES_LIMIT_DEFAULT } from "@repo/shared/constants/limits";
import { currentUserAtom } from "#components/user/models/current-user.model";
import { categoriesClient } from "#shared/forum-client";
import { FastAverageColor } from 'fast-average-color';
import { Node } from "slate";
import { validateResponse } from "#shared/api/validation";

export const deserializeNodes = (value: string) => {
  return value.split("\n").map((line) => {
    return { children: [{ text: line }] };
  });
};

export const serializeNodes = (value: any[]) =>
  value.map((n) => Node.string(n)).join("\n");

export const availableCategoriesAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(async () => {
    const res = await categoriesClient.category["available-categories"].$get(
      {}, { init: { signal: ctx.controller.signal } }
    )

    return validateResponse<typeof res>(res)
  })
}, {
  name: "availableCategoriesAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
}).pipe(withDataAtom(), withStatusesAtom(), withCache({ swr: false }))

type CreateThread = Omit<z.infer<typeof createThreadSchema>,
  | "content" | "images" | "category_id" | "tags" | "visibility"
>

type ThreadForm = CreateThread & {
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
export const threadFormIsCommentAtom = atom(true, "threadFormIsComment").pipe(withReset())
export const threadFormPermissionAtom = atom(false, "threadFormPermission").pipe(withReset())
export const tagValueAtom = atom<string>("", "tagValue").pipe(withReset())

export const threadFormIsValidAtom = atom((ctx) => ctx.spy(threadFormStepAtom) === 'done').pipe(withReset());

export const threadFormTitleIsValidAtom = atom((ctx) => {
  const target = ctx.spy(threadFormTitleAtom)
  return threadTitleSchema.safeParse(target).success
}, "threadFormTitleIsValidAtom").pipe(withReset())

export const threadFormCategoryIsValidAtom = atom((ctx) => {
  const target = ctx.spy(threadFormCategoryAtom)
  return threadCategorySchema.safeParse(target).success
}, "threadFormCategoryIsValidAtom").pipe(withReset())

export const threadFormContentIsValidAtom = atom((ctx) => {
  const target = ctx.spy(threadFormContentAtom)
  return threadContentSchema.safeParse(serializeNodes(target)).success
}, "threadFormContentIsValidAtom").pipe(withReset())

export const formStepsConfig = [
  { id: "title", isValidAtom: threadFormTitleIsValidAtom },
  { id: "category", isValidAtom: threadFormCategoryIsValidAtom },
  { id: "content", isValidAtom: threadFormContentIsValidAtom },
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

export const bgColorAtom = reatomMap<number, string>([]).pipe(withReset())

const fac = new FastAverageColor();

export const addImagesAction = action(async (ctx, e: React.ChangeEvent<HTMLInputElement>) => {
  const currentUser = ctx.get(currentUserAtom)
  if (!currentUser) return;

  const MAX_IMAGES = currentUser.is_donate ? THREAD_IMAGES_LIMIT_DEFAULT[2] : THREAD_IMAGES_LIMIT_DEFAULT[1];

  const newImages: File[] | null = e.target.files
    ? (Array.from(e.target.files).slice(THREAD_IMAGES_LIMIT_DEFAULT[0], MAX_IMAGES) as Array<File>)
    : null;

  e.preventDefault();

  if (!newImages) return;

  const existsImages = ctx.get(threadFormImagesAtom) ?? [];
  const newImagesUrls: string[] = newImages.map(target => URL.createObjectURL(target));
  const updatedImages: string[] = existsImages ? [...existsImages, ...newImagesUrls] : newImagesUrls;

  for (let i = 0; i < newImagesUrls.length; i++) {
    const absoluteIndex = newImages?.length ? newImages.length + i : i;

    const color = (
      await fac.getColorAsync(newImagesUrls[i])
    ).hex;

    bgColorAtom.set(ctx, absoluteIndex, color);
  }

  threadFormImagesAtom(ctx, updatedImages)
}, "addImagesAction")

export const deleteImageAction = action((
  ctx, 
  e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.ChangeEvent<HTMLInputElement>, 
  index: number
) => {
  e.preventDefault();

  const existsImages = ctx.get(threadFormImagesAtom) ?? []

  const updatedImages = existsImages.length <= 1
    ? null
    : existsImages.filter((_, i) => i !== index);

  bgColorAtom.delete(ctx, index);

  const total = existsImages.length;

  for (let i = index + 1; i < total; i++) {
    const color = bgColorAtom.get(ctx, i);

    if (color !== undefined) {
      bgColorAtom.set(ctx, i - 1, color);
      bgColorAtom.delete(ctx, i);
    }
  }

  threadFormImagesAtom(ctx, updatedImages);
}, "deleteImageAction")

export function createThreadFormReset(ctx: Ctx) {
  batch(ctx, () => {
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
  })
}