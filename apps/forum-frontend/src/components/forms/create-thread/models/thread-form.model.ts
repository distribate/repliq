import { createThreadSchema } from "@repo/types/schemas/thread/create-thread-schema.ts";
import { z } from "zod";
import { Value } from "@udecode/plate";
import { atom, Ctx } from "@reatom/core";
import { withReset } from "@reatom/framework";
import { logger } from "@repo/lib/utils/logger";

export type ThreadFormQuery = Omit<z.infer<typeof createThreadSchema>,
  | "content"
  | "images"
  | "category_id"
  | "tags"
  | "visibility"
> & {
  content: Value
  images: string[] | null
  tags: string[] | null
  visibility: "all" | "friends"
  category_id: number | null
};

export const threadFormTitleAtom = atom<ThreadFormQuery["title"]>("", "threadFormTitle").pipe(withReset())
export const threadFormContentAtom = atom<ThreadFormQuery["content"]>([], "threadFormContent").pipe(withReset())
export const threadFormDescriptionAtom = atom<ThreadFormQuery["description"]>(null, "threadFormDescription").pipe(withReset())
export const threadFormImagesAtom = atom<ThreadFormQuery["images"]>(null, "threadFormImages").pipe(withReset())
export const threadFormVisibilityAtom = atom<ThreadFormQuery["visibility"]>("all", "threadFormVisibility").pipe(withReset())
export const threadFormTagsAtom = atom<ThreadFormQuery["tags"]>(null, "threadFormTags").pipe(withReset())
export const threadFormCategoryAtom = atom<ThreadFormQuery["category_id"]>(null, "threadFormCategory").pipe(withReset())
export const threadFormPreferencesAtom = atom<{ is_comments: ThreadFormQuery["is_comments"] }>({ is_comments: true }, "threadFormPreferences").pipe(withReset())
export const threadFormPermissionAtom = atom(false, "threadFormPermission")

threadFormContentAtom.onChange((_, state) => logger.info("threadFormContentAtom", state))

export function createThreadFormReset(ctx: Ctx) {
  threadFormTitleAtom.reset(ctx)
  threadFormContentAtom.reset(ctx)
  threadFormDescriptionAtom.reset(ctx)
  threadFormImagesAtom.reset(ctx)
  threadFormVisibilityAtom.reset(ctx)
  threadFormTagsAtom.reset(ctx)
  threadFormCategoryAtom.reset(ctx)
  threadFormPreferencesAtom.reset(ctx)
}