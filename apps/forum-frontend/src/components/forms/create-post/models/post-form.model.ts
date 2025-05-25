import { atom } from "@reatom/core";
import { withReset } from "@reatom/framework";

export type VisibilityPost = "only" | "all" | "friends";

type CreatePostFieldType = {
  isActive: boolean;
  visibility: VisibilityPost;
  content: string | null;
};

const initial: CreatePostFieldType = {
  isActive: false,
  content: null,
  visibility: "all",
};

export const postFormFieldAtom = atom<CreatePostFieldType>(initial, "postFormField").pipe(withReset())