import { getPostsControlAtom } from "#components/post/post-item/models/post-control.model";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { atom } from "@reatom/core";
import { forumCommentClient, forumPostClient } from "#shared/forum-client";
import { postsDataAtom } from "#components/profile/posts/models/posts.model";

type ControlPostActionType = "delete" | "edit" | "pin" | "comments";

type ControlPost = {
  id: string;
  nickname: string;
  type: ControlPostActionType;
};

async function pinPost({ id, value }: { id: string; value: boolean }) {
  const res = await forumPostClient.post["pin-post"].$post({ json: { id, value } })
  const data = await res.json();
  if ("error" in data) return null
  return data;
}

async function editPost({ content, id }: { id: string, content: string }) {
  const res = await forumPostClient.post["edit-post"].$post({ json: { id, content } })
  const data = await res.json();
  if ("error" in data) return null
  return data;
}

async function disablePostComments({ id }: { id: string }) {
  const res = await forumCommentClient.comment["disable-comments"].$post({ json: { id, type: "post" } })
  const data = await res.json();
  if ("error" in data) return null
  return data;
}

async function deletePost({ id }: { id: string }) {
  const res = await forumPostClient.post["delete-post"].$delete({ json: { id } })
  const data = await res.json();
  if ("error" in data) return null
  return data;
}

const controlPostActionVariablesAtom = atom<ControlPost | null>(null, "controlPostActionVariables")

export const controlPostAction = reatomAsync(async (ctx, values: ControlPost) => {
  const { id, type } = values;

  const posts = ctx.get(postsDataAtom)
  if (!posts) throw new Error("Posts not found")

  let post = posts.find(p => p.id === id);
  if (!post) throw new Error("Post not found")

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
      throw new Error(`Type is not defined ${type}`)
  }
}, {
  name: "controlPostAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
  onFulfill: (ctx, res) => {
    if (!res) return;

    const variables = ctx.get(controlPostActionVariablesAtom)!

    if (variables.type === 'comments') {
      // @ts-expect-error
      const data = res.data as {
        is_comments: boolean;
      }

      postsDataAtom(ctx, (state) => {
        if (!state) state = [];

        if (res.status !== 'Success') {
          return state;
        }

        const post = state.find((post) => post.id === variables.id);
        if (!post) return [];

        const updatedPost = {
          ...post,
          isComments: data.is_comments,
        };

        const newData = state.map(post => post.id === updatedPost.id ? updatedPost : post)

        return newData
      })
    }

    if (variables.type === 'delete') {
      postsDataAtom(ctx, (state) => {
        if (!state) state = [];

        if (res.status !== 'Success') {
          return state;
        }

        const newData = state.filter(post => post.id !== variables.id);

        return newData
      })
    }

    if (variables.type === 'edit') {
      // @ts-expect-error
      const data = res.data as {
        content: string;
      }

      postsDataAtom(ctx, (state) => {
        if (!state) state = [];

        if (res.status !== 'Success') {
          return state;
        }

        const newData = state.map(post =>
          post.id === variables.id
            ? { ...post, content: data.content }
            : post
        );

        return newData
      });
    }

    if (variables.type === 'pin') {
      // @ts-expect-error
      const data = res.data as {
        isPinned: boolean;
      }

      postsDataAtom(ctx, (state) => {
        if (!state) state = [];

        if (res.status !== 'Success') {
          return state;
        }

        const newData = state.map((post) =>
          post.id === variables.id
            ? { ...post, isPinned: data.isPinned }
            : post
        )

        return newData
      })
    }
  }
}).pipe(withStatusesAtom())