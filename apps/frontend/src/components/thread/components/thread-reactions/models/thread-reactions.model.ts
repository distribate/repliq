import { toast } from "sonner";
import { reatomAsync, withDataAtom, withStatusesAtom } from "@reatom/framework";
import { threadClient } from "#shared/api/forum-client";
import { validateResponse } from "#shared/api/validation";
import { log } from "#shared/utils/log";
import { applyDiff, ReactionsDiff, UpdateReaction } from "#shared/models/reactions.model";

export const threadReactionsAction = reatomAsync(async (ctx, id: string) => {
  return await ctx.schedule(async () => {
    const res = await threadClient.thread["reactions"][":id"].$get({ param: { id } });
    return validateResponse<typeof res>(res)
  })
}, {
  name: "threadReactionsAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
}).pipe(withDataAtom(), withStatusesAtom())

export const addThreadReactionAction = reatomAsync(async (ctx, { emoji, id }: UpdateReaction) => {
  return await ctx.schedule(async () => {
    const res = await threadClient.thread["reaction"][":id"].$post({
      param: { id },
      json: { emoji },
    });

    return validateResponse<typeof res>(res)
  })
}, {
  name: "addThreadReactionAction",
  onFulfill: (ctx, res) => {
    const outputValues = res;

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

    threadReactionsAction.dataAtom(ctx, (state) => {
      const toUpdate = {
        byTarget: state?.byThread ?? { reactions: {} },
        byUser: state?.byUser ?? { reactions: [] }
      }

      const update = applyDiff(toUpdate, diff)

      return {
        byThread: update.byTarget,
        byUser: update.byUser
      }
    });
  },
  onReject: (_, e) => {
    if (e instanceof Error) {
      toast.error("Не удалось обновить реакции")
      console.error(e.message)
    }
  },
})

threadReactionsAction.dataAtom.onChange((_, v) => log("threadReactionsAction.dataAtom", v))