import { toast } from "sonner";
import { createReactionSchema } from "@repo/types/schemas/reaction/create-reaction";
import * as z from "zod";
import { atom, reatomAsync, withDataAtom, withStatusesAtom } from "@reatom/framework";
import { postClient, threadClient } from "#shared/forum-client";
import { validateResponse } from "#shared/api/validation";
import { log } from "#lib/utils";

type UpdateReaction = Omit<z.infer<typeof createReactionSchema>, "type">;

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

type UserReactions = {
  reactions: string[]
}

type TargetReactions = {
  reactions: Record<string, number>
}

type TargetReactionsState = {
  byUser: UserReactions
  byTarget: TargetReactions
};

type Diff = {
  add?: string[];
  remove?: string[]
};

function applyDiff(
  state: TargetReactionsState | null,
  { add = [], remove = [] }: Diff
): TargetReactionsState {
  const prevUserReactions = state?.byUser.reactions ?? [];
  const prevReactions = state?.byTarget.reactions ?? {};

  let newUserReactions = prevUserReactions.filter(r => !remove.includes(r));

  for (const emoji of add) {
    if (!newUserReactions.includes(emoji)) {
      newUserReactions = [...newUserReactions, emoji];
    }
  }

  const newReactions: Record<string, number> = { ...prevReactions };

  for (const emoji of remove) {
    const count = newReactions[emoji] ?? 0;

    if (count > 1) {
      newReactions[emoji] = count - 1;
    }

    else delete newReactions[emoji];
  }

  for (const emoji of add) {
    newReactions[emoji] = (newReactions[emoji] ?? 0) + 1;
  }

  return {
    byUser: { reactions: newUserReactions },
    byTarget: { reactions: newReactions }
  };
}

export const addThreadReactionAction = reatomAsync(async (ctx, values: UpdateReaction) => {
  const { emoji, id } = values;

  const result = await ctx.schedule(async () => {
    const res = await threadClient.thread["reaction"][":id"].$post({
      param: { id },
      json: { emoji },
    });

    return validateResponse<typeof res>(res)
  })

  return { result, values }
}, {
  name: "addThreadReactionAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
      toast.error("Что-то пошло не так")
    }
  },
  onFulfill: (ctx, res) => {
    const { result: outputValues } = res;

    let diff: Diff | null = null;

    if (outputValues.status === "created" && outputValues.updatedTo) {
      diff = { add: [outputValues.updatedTo.emoji] };
    }

    if (outputValues.status === "deleted" && outputValues.removedTo) {
      diff = { remove: [outputValues.removedTo.emoji] };
    }

    if (outputValues.status === "created-and-removed") {
      diff = {
        add: outputValues.updatedTo ? [outputValues.updatedTo.emoji] : [],
        remove: outputValues.removedTo ? [outputValues.removedTo.emoji] : []
      };
    }

    if (diff) {
      threadReactionsAction.dataAtom(ctx, (state) => {
        const update = applyDiff({
          byTarget: state?.byThread ?? { reactions: {} },
          byUser: state?.byUser ?? { reactions: [] }
        }, diff)

        return {
          byThread: update.byTarget,
          byUser: update.byUser
        }
      });
    }
  }
})

type PostsReactionsState = {
  byPost: TargetReactions,
  byUser: UserReactions
}

const postsReactionsAtom = atom<Record<string, PostsReactionsState>>({}, "postsReactions");

export const addPostReactionAction = reatomAsync(async (ctx, values: UpdateReaction) => {
  const { emoji, id } = values;

  const result = await ctx.schedule(async () => {
    const res = await postClient.post["reaction"][":id"].$post({
      param: { id },
      json: { emoji },
    });

    return validateResponse<typeof res>(res)
  })

  return { result, values }
}, {
  name: "addPostReactionAction",
  onFulfill: (ctx, res) => {
    const { result: outputValues, values: inputValues } = res;

    let diff: Diff | null = null;

    if (outputValues.status === "created" && outputValues.updatedTo) {
      diff = { add: [outputValues.updatedTo.emoji] };
    }

    if (outputValues.status === "deleted" && outputValues.removedTo) {
      diff = { remove: [outputValues.removedTo.emoji] };
    }

    if (outputValues.status === "created-and-removed") {
      diff = {
        add: outputValues.updatedTo ? [outputValues.updatedTo.emoji] : [],
        remove: outputValues.removedTo ? [outputValues.removedTo.emoji] : []
      };
    }

    if (diff) {
      postsReactionsAtom(ctx, (state) => {
        const id = inputValues.id;
        const target = state[id];

        const update = applyDiff({
          byTarget: target?.byPost ?? { reactions: {} },
          byUser: target?.byUser ?? { reactions: [] }
        }, diff)

        return {
          ...state,
          [id]: {
            byPost: update.byTarget,
            byUser: update.byUser
          }
        }
      });
    }
  },
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
      toast.error("Что-то пошло не так")
    }
  }
})

threadReactionsAction.dataAtom.onChange((_, v) => log("threadReactionsAction.dataAtom", v))

postsReactionsAtom.onChange((_, v) => log("postsReactionsAtom", v))