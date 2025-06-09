import { REACTIONS } from "@repo/shared/constants/emojis";
import { ThreadReactionsSkeleton } from "./thread-reactions-skeleton";
import { ReactionItem } from "../../../reactions/components/reaction-item";
import { reatomComponent } from "@reatom/npm-react";
import { threadReactionsAction } from "../models/thread-reactions.model";
import { threadParamAtom } from "#components/thread/thread-main/models/thread.model";

const Reactions = reatomComponent(({ ctx }) => {
  const threadId = ctx.spy(threadParamAtom)
  const data = ctx.spy(threadReactionsAction.dataAtom)

  if (!data || !threadId) return null;

  const userReactions = data.userReactions ?? { reactions: [] };
  const threadReactions = data.threadReactions.reactions ?? {};

  return (
    ctx.spy(threadReactionsAction.statusesAtom).isPending ? (
      <ThreadReactionsSkeleton />
    ) : (
      <div className="flex items-center w-fit gap-2">
        {Object.keys(threadReactions).map((emojiName) => {
          const count = threadReactions[emojiName];
          const isLiked = userReactions.reactions.includes(emojiName) ? true : false;

          const Icon = REACTIONS[emojiName];

          return (
            <ReactionItem
              key={emojiName}
              isLiked={isLiked}
              threadId={threadId}
              emoji={emojiName}
              reactionCount={count}
              Icon={Icon}
            />
          );
        })}
      </div>
    )
  )
})

export const ThreadReactions = () => {
  return (
    <Reactions />
  )
}