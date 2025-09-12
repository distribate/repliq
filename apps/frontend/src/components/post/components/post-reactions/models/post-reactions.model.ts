import { log } from "#shared/utils/log";
import { validateResponse } from "#shared/api/validation";
import { postClient } from "#shared/api/forum-client";
import { applyDiff, ReactionsDiff, TargetReactions, UpdateReaction, UserReactions } from "#shared/models/reactions.model";
import { reatomAsync } from "@reatom/async";
import { atom } from "@reatom/core";
import { toast } from "sonner";

type PostsReactionsState = {
  byPost: TargetReactions,
  byUser: UserReactions
}

const postsReactionsAtom = atom<Record<string, PostsReactionsState>>({}, "postsReactions");

export const addPostReactionAction = reatomAsync(async (ctx, { emoji, id, postId }: UpdateReaction & { postId: string }) => {
  const result = await ctx.schedule(async () => {
    const res = await postClient.post["reaction"][":id"].$post({
      param: { id },
      json: { emoji },
    });

    return validateResponse<typeof res>(res)
  })

  return { result, postId }
}, {
  name: "addPostReactionAction",
  onFulfill: (ctx, { result: outputValues, postId }) => {
    let diff: ReactionsDiff | null = null;

    const { status, updatedTo, removedTo } = outputValues

    if (status === "created" && updatedTo) {
      diff = {
        add: updatedTo.emoji
      };
    }

    if (status === "deleted" && removedTo) {
      diff = {
        remove: removedTo.emoji
      };
    }

    if (status === "created-and-removed") {
      diff = {
        add: updatedTo ? updatedTo.emoji : undefined,
        remove: removedTo ? removedTo.emoji : undefined
      };
    }

    if (!diff) return;

    postsReactionsAtom(ctx, (state) => {
      const target = state[postId];

      const toUpdate = {
        byTarget: target?.byPost ?? { reactions: {} },
        byUser: target?.byUser ?? { reactions: [] }
      }

      const update = applyDiff(toUpdate, diff)

      return {
        ...state,
        [postId]: {
          byPost: update.byTarget,
          byUser: update.byUser
        }
      }
    });
  },
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
      toast.error("Что-то пошло не так")
    }
  }
})

postsReactionsAtom.onChange((_, v) => log("postsReactionsAtom", v))