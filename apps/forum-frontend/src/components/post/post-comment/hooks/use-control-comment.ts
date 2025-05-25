import { reatomAsync } from "@reatom/async";

type ControlCommentType = "remove" | "edit";

type ControlComment = {
  type: ControlCommentType;
  post_id: string;
};

export const controlCommentAction = reatomAsync(async (ctx, { post_id, type }: ControlComment) => {
  console.log(post_id, type)
})
