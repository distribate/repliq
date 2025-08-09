import { toast } from "sonner";
import { forumReactionClient } from "#shared/forum-client";
import { createReactionSchema } from "@repo/types/schemas/reaction/create-reaction";
import * as z from "zod";
import { atom, reatomAsync, withDataAtom, withStatusesAtom } from "@reatom/framework";
import { forumThreadClient } from "#shared/forum-client";

type UpdateThreadRating = Omit<z.infer<typeof createReactionSchema>, "type">;

export const threadReactionsAction = reatomAsync(async (ctx, id: string) => {
  return await ctx.schedule(async () => {
    const res = await forumThreadClient.thread["get-thread-user-reactions"][":id"].$get({ param: { id }, });
    const data = await res.json();

    if ("error" in data) throw new Error(data.error)

    return data.data;
  })
}, "threadReactionsAction").pipe(withDataAtom(), withStatusesAtom())

const THREAD_RATING_MESSAGES: Record<string, string> = {
  "Reacted": "Вы уже оценивали тред",
  "Created": "Вы оценили тред",
  "Deleted": "Вы удалили оценку треда",
  "Limit exceeded": ""
}

const addReactionActionVariablesAtom = atom<UpdateThreadRating | null>(null, "addReactionActionVariables")

threadReactionsAction.dataAtom.onChange((ctx, state) => console.log(state))

export const addReactionAction = reatomAsync(async (ctx, values: UpdateThreadRating) => {
  addReactionActionVariablesAtom(ctx, values)

  return await ctx.schedule(async () => {
    const { emoji, id } = values;

    const createReaction = await forumReactionClient.reaction["create-reaction"].$post({
      json: { emoji, id, type: "thread", },
    });

    return await createReaction.json()
  })
}, {
  name: "addReactionAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
  onFulfill: (ctx, res) => {
    if (!res) return;

    if ("error" in res) {
      return toast.error(THREAD_RATING_MESSAGES[res.error] ?? "Что-то пошло не так")
    }

    const variables = ctx.get(addReactionActionVariablesAtom)
    if (!variables) return;

    const { emoji } = variables;

    if (res.status === 'Created') {
      threadReactionsAction.dataAtom(ctx, (state) => {
        console.log(state)
        const prevUserReactions = state ? state.byUser.reactions : []
        const prevThreadReactions = state ? state.byThread.reactions : {}

        let newUserReactions = [...prevUserReactions, emoji]

        const newThreadReaction = { [emoji]: 1 }
        let newThreadReactions = { ...prevThreadReactions, ...newThreadReaction }

        return {
          byUser: { reactions: newUserReactions },
          byThread: { reactions: newThreadReactions }
        }
      })
    }

    if (res.status === 'Deleted') {
      threadReactionsAction.dataAtom(ctx, (state) => {
        const prevUserReactions = state ? state.byUser.reactions : []
        const prevThreadReactions = state ? state.byThread.reactions : {}

        const newUserReactions = prevUserReactions.filter(reaction => reaction !== emoji)

        delete prevThreadReactions[emoji]

        return {
          byUser: { reactions: newUserReactions },
          byThread: { reactions: prevThreadReactions }
        }
      })
    }
  }
})