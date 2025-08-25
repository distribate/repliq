import { postsFilteringAtom } from "./filter-posts.model";
import { getPosts, postsDataAtom, postsMetaAtom } from "./posts.model";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { requestedUserParamAtom } from "#components/profile/main/models/requested-user.model";
import { atom } from "@reatom/core";

type UpdatePosts = {
  nickname: string,
  type: "update-filter" | "update-cursor"
}

const updatePostsVariablesAtom = atom<UpdatePosts | null>(null, "updatePostsVariablesAtom")

export const updatePostsAction = reatomAsync(async (ctx, options: UpdatePosts) => {
  const filtering = ctx.get(postsFilteringAtom)
  const target = ctx.get(requestedUserParamAtom)

  if (!filtering || !target) return;

  updatePostsVariablesAtom(ctx, options)

  return await getPosts({ nickname: target, ...filtering })
}, {
  name: "updatePostsAction",
  onFulfill: (ctx, res) => {
    if (!res) {
      return
    }

    const variables = ctx.get(updatePostsVariablesAtom)
    if (!variables) return;

    if (variables.type === "update-filter") {
      postsDataAtom(ctx, res.data)
      postsMetaAtom(ctx, res.meta)
      postsFilteringAtom(ctx, (state) => ({ ...state, cursor: res.meta.endCursor }))
      return
    }

    postsDataAtom(ctx, (state) => state ? (
      [
        ...state,
        ...res.data.filter(post => !state.some(exist => exist.id === post.id))
      ]
    ) : null)

    postsMetaAtom(ctx, res.meta)
  }
}).pipe(withStatusesAtom())