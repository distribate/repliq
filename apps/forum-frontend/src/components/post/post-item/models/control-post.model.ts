import { getPostsControlAtom } from "#components/post/post-item/models/post-control.model";
import { toast } from "sonner";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { postsDataAtom } from "#components/profile/posts/posts/models/posts.model";
import { atom } from "@reatom/core";
import { forumCommentClient, forumPostClient } from "@repo/shared/api/forum-client";

type ControlPostActionType = "delete" | "edit" | "pin" | "comments";

type ControlPost = {
  id: string;
  nickname: string;
  type: ControlPostActionType;
};

async function pinPost({
  id,
  value
}: {
  id: string;
  value: boolean
}) {
  const res = await forumPostClient.post["pin-post"].$post({
    json: { id, value }
  })

  const data = await res.json();

  if ("error" in data) {
    return null
  }

  return data;
}

async function editPost({
  content, id
}: {
  id: string,
  content: string
}) {
  const res = await forumPostClient.post["edit-post"].$post({
    json: {  id, content }
  })

  const data = await res.json();

  if ("error" in data) {
    return null
  }

  return data;
}

async function disablePostComments({
  id
}: {
  id: string
}) {
  const res = await forumCommentClient.comment["disable-comments"].$post({
    json: {
      id,
      type: "post"
    }
  })

  const data = await res.json();

  if ("error" in data) {
    return null
  }

  return data;
}

async function deletePost({
  id
}: {
  id: string
}) {
  const res = await forumPostClient.post["delete-post"].$delete({
    json: { id  }
  })

  const data = await res.json();

  if ("error" in data) {
    return null
  }

  return data;
}

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