import { atom } from "@reatom/core";
import { withReset } from "@reatom/framework";

export type CreateThreadCommentType = "single" | "reply";

export type RepliedValuesType = {
  commentId: number;
  commentNickname: string;
  commentContent: string;
};

export type CreateThreadComment = {
  threadId: string;
  type: CreateThreadCommentType;
  replied: RepliedValuesType | null;
  content: string;
}

const initial: CreateThreadComment = { 
  content: "", 
  threadId: "", 
  type: "single",
  replied: null 
}

export const createThreadCommentAtom = atom<CreateThreadComment>(initial, "createThreadComment").pipe(
  withReset()
)