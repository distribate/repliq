import { toast } from "sonner";
import { forumReactionClient } from "@repo/shared/api/forum-client";
import { createReactionSchema } from "@repo/types/schemas/reaction/create-reaction";
import { z } from "zod";
import { atom, reatomAsync, withDataAtom, withStatusesAtom } from "@reatom/framework";
import { forumThreadClient } from "@repo/shared/api/forum-client";
import { UnwrapPromise } from "@repo/lib/helpers/unwrap-promise-type";
import consola from "consola";

type UpdateThreadRating = Omit<z.infer<typeof createReactionSchema>, "type">;

async function getThreadReactions(threadId: string) {
  const res = await forumThreadClient.thread["get-thread-user-reactions"][":threadId"].$get({ param: { threadId }, });
  const data = await res.json();
  if (!data || "error" in data) return null;
  return data.data;
}

export const threadReactionsAtom = atom<UnwrapPromise<ReturnType<typeof getThreadReactions>> | null>(null, "threadReactions")

threadReactionsAtom.onChange((_, state) => consola.info("threadReactionsAtom", state))

export const threadReactionsAction = reatomAsync(async (ctx, target: string) => {
  return await ctx.schedule(() => getThreadReactions(target))
}, {
  name: "threadReactionsAction",
  onFulfill: (ctx, res) => threadReactionsAtom(ctx, res),
}).pipe(withDataAtom(), withStatusesAtom())

export async function addReactionToThread({ emoji, id }: UpdateThreadRating) {
  const createReaction = await forumReactionClient.reaction["create-reaction"].$post({
    json: { emoji, id, type: "thread", },
  });

  return await createReaction.json()
}

const THREAD_RATING_MESSAGES: Record<string, string> = {
  "Reacted": "Вы уже оценивали тред",
  "Created": "Вы оценили тред",
  "Deleted": "Вы удалили оценку треда",
  "Limit exceeded": ""
}

const addReactionActionVariablesAtom = atom<UpdateThreadRating | null>(null, "addReactionActionVariables")

export const addReactionAction = reatomAsync(async (ctx, values: UpdateThreadRating) => {
  addReactionActionVariablesAtom(ctx, values)

  return await ctx.schedule(() => addReactionToThread(values))
}, {
  name: "addReactionAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    if ("error" in res) {
      return toast.error(THREAD_RATING_MESSAGES[res.error] ?? "Что-то пошло не так")
    }

    const variables = ctx.get(addReactionActionVariablesAtom)
    if (!variables) return;

    const { emoji } = variables;

    if (res.status === 'Created') {
      threadReactionsAtom(ctx, (state) => {
        const prevUserReactions = state ? state.userReactions.reactions : []
        const prevThreadReactions = state ? state.threadReactions.reactions : {}

        let newUserReactions = [...prevUserReactions, emoji]

        const newThreadReaction = { [emoji]: 1 }
        let newThreadReactions = { ...prevThreadReactions, ...newThreadReaction }

        return { 
          userReactions: { reactions: newUserReactions }, 
          threadReactions: { reactions: newThreadReactions } 
        }
      })
    }

    if (res.status === 'Deleted') {
      threadReactionsAtom(ctx, (state) => {
        const prevUserReactions = state ? state.userReactions.reactions : []
        const prevThreadReactions = state ? state.threadReactions.reactions : {}

        const newUserReactions = prevUserReactions.filter(reaction => reaction !== emoji)
        
        delete prevThreadReactions[emoji]

        return { 
          userReactions: { reactions: newUserReactions }, 
          threadReactions: { reactions: prevThreadReactions } 
        }
      })
    }
  }
})