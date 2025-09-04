import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { commentClient, postClient } from "#shared/forum-client";
import { postsDataAtom } from "#components/profile/posts/models/posts.model";
import { editPostsControlAtom } from "./post-control.model";
import { toast } from "sonner";
import { batch } from "@reatom/core";

type ControlPost = {
  id: string;
  nickname: string;
};

async function pinPost({ id, value }: { id: string; value: boolean }) {
  const res = await postClient.post["pin-post"].$post({ json: { id, value } })
  const data = await res.json();
  if ("error" in data) throw new Error(data.error)
  return data;
}

async function editPost({ content, id }: { id: string, content: string }) {
  const res = await postClient.post["edit-post"].$post({ json: { id, content } })
  const data = await res.json();
  if ("error" in data) throw new Error(data.error)
  return data;
}

async function disablePostComments({ id }: { id: string }) {
  const res = await commentClient.comment["disable-comments"].$post({ json: { id, type: "post" } })
  const data = await res.json();
  if ("error" in data) throw new Error(data.error)
  return data;
}

async function deletePost({ id }: { id: string }) {
  const res = await postClient.post["delete-post"].$delete({ json: { id } })
  const data = await res.json();
  if ("error" in data) throw new Error(data.error)
  return data;
}

export const pinPostAction = reatomAsync(async (ctx, values: ControlPost & { currentState: boolean }) => {
  const { id, currentState } = values;

  const result = await ctx.schedule(() => pinPost({ id, value: !currentState }))

  return { result, id }
}, {
  name: "pinPostAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
  onFulfill: (ctx, res) => {
    if (!res) return;

    const { result, id } = res;

    postsDataAtom(ctx, (state) => {
      if (!state) state = [];

      if (result.status !== 'Success') return state;

      const newData = state.map((post) =>
        post.id === id ? { ...post, isPinned: result.data.isPinned } : post
      )

      return newData
    })
  }
}).pipe(withStatusesAtom())

export const editPostContentAction = reatomAsync(async (ctx, values: ControlPost & { content: string }) => {
  const { id, content } = values;

  const result = await ctx.schedule(() => editPost({ id, content }))

  return { result, id }
}, {
  name: "editPostContentAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
  onFulfill: (ctx, res) => {
    if (!res) return;

    const { result, id } = res;

    const updatedContent = result.data.content

    batch(ctx, () => {
      postsDataAtom(ctx, (state) => {
        if (!state) state = [];
  
        if (result.status !== 'Success') return state;
  
        const newData = state.map(post =>
          post.id === id ? { ...post, content: updatedContent } : post
        );
  
        return newData
      });
  
      toast.success("Обновлено")

      editPostsControlAtom(ctx, id, { isEdit: false })
    })
  }
}).pipe(withStatusesAtom())

export const deletePostAction = reatomAsync(async (ctx, values: ControlPost) => {
  const { id } = values;

  const result = await ctx.schedule(() => deletePost({ id }))

  return { result, id }
}, {
  name: "deletePostAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
  onFulfill: (ctx, res) => {
    if (!res) return;

    const { result, id } = res;

    batch(ctx, () => {
      postsDataAtom(ctx, (state) => {
        if (!state) state = [];
  
        if (result.status !== 'Success') return state;
  
        const newData = state.filter(post => post.id !== id);
  
        return newData
      })
      
      toast.success("Пост удален")
    })
  }
}).pipe(withStatusesAtom())

export const disablePostCommentsAction = reatomAsync(async (ctx, values: ControlPost) => {
  const { id } = values;

  const result = await ctx.schedule(() => disablePostComments({ id }))

  return { result, id }
}, {
  name: "disablePostCommentsAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
  onFulfill: (ctx, res) => {
    if (!res) return;

    const { result, id } = res;

    const data = result.data as {
      is_comments: boolean;
    }

    postsDataAtom(ctx, (state) => {
      if (!state) state = [];

      if (result.status !== 'Success') return state;

      const newData = state.map((post) =>
        post.id === id
          ? { ...post, isComments: data.is_comments }
          : post
      )

      return newData
    })
  }
}).pipe(withStatusesAtom())