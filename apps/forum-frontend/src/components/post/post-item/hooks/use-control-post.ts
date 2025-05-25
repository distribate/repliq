import { getPostsControlAtom } from "#components/post/post-item/queries/post-control-query.ts";
import { toast } from "sonner";
import { pinPost } from "../queries/pin-post";
import { disablePostComments } from "../queries/disable-post-comments";
import { deletePost } from "../queries/delete-post";
import { editPost } from "../queries/edit-post";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { postsDataAtom } from "#components/profile/posts/posts/models/posts.model";
import { atom } from "@reatom/core";

type ControlPostActionType = "delete" | "edit" | "pin" | "comments";

type ControlPost = {
  id: string;
  nickname: string;
  type: ControlPostActionType;
};

const controlPostActionVariablesAtom = atom<ControlPost | null>(null, "controlPostActionVariables")

export const controlPostAction = reatomAsync(async (ctx, values: ControlPost) => {
  const { id, type } = values;

  const posts = ctx.get(postsDataAtom)
  if (!posts) return;

  let post = posts.find(p => p.id === id);

  if (!post) return;

  const { content: prev } = post;

  const content = getPostsControlAtom(ctx, id).content

  controlPostActionVariablesAtom(ctx, values)

  switch (type) {
    case "pin":
      return pinPost({ id, value: !post.isPinned });
    case "comments":
      return disablePostComments({ id });
    case "delete":
      return deletePost({ id });
    case "edit":
      return editPost({ id, content: content ?? prev });
    default:
      break;
  }
}, {
  name: "controlPostAction",
  onFulfill: (ctx, res) => {
    if (!res) return toast.error("Произошла ошибка");

    const variables = ctx.get(controlPostActionVariablesAtom)!

    switch (variables.type) {
      case "comments":
        return postsDataAtom(ctx, (state) => {
          if (!state) return state;

          // @ts-ignore
          if ((res.status !== 'Success') || ("is_comments" in res.data)) {
            return;
          }

          const post = state.find((post) => post.id === variables.id);

          const updatedPost = {
            ...post,
            // @ts-ignore
            isComments: data.data.isComments,
          };

          return state.map((post) => post.id === updatedPost.id ? updatedPost : post,)
        })
      case "delete":
        return postsDataAtom(ctx, (state) => {
          if (!state) return null;

          if (res.status !== 'Success') {
            return;
          }

          const newData = state.filter(
            (post) => post.id !== variables.id,
          );

          return newData
        })
      case "edit":
        return postsDataAtom(ctx, (state) => {
          if (!state) return null;

          if (res.status !== 'Success') {
            return;
          }

          return state.map((post) =>
            post.id === variables.id
              // @ts-ignore
              ? { ...post, content: data.data.content }
              : post,
          )
        })
      case "pin":
        return postsDataAtom(ctx, (state) => {
          if (!state) return null;

          if (res.status !== 'Success') {
            return;
          }

          return state.map((post) =>
            post.id === variables.id
              // @ts-ignore
              ? { ...post, isPinned: data.data.isPinned }
              : post,
          )
        })
      default:
        break;
    }
  }
}).pipe(withStatusesAtom())