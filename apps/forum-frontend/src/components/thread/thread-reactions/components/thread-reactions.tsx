import { REACTIONS } from "@repo/shared/constants/emojis";
import { ReactionItem } from "#components/reactions/components/reaction-item";
import { reatomComponent } from "@reatom/npm-react";
import { threadReactionsAction } from "../models/thread-reactions.model";
import { threadParamAtom } from "#components/thread/thread-main/models/thread.model";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";

const ThreadReactionsSkeleton = () => {
  return (
    <div className="flex items-center w-fit gap-2">
      <Skeleton className="h-8 w-12" />
      <Skeleton className="h-8 w-12" />
      <Skeleton className="h-8 w-12" />
      <Skeleton className="h-8 w-12" />
    </div>
  );
};

export const ThreadReactions = reatomComponent(({ ctx }) => {
  const threadId = ctx.spy(threadParamAtom)
  const data = ctx.spy(threadReactionsAction.dataAtom)

  if (!data || !threadId) return null;

  const userReactions = data.byUser ?? { reactions: [] };
  const threadReactions = data.byThread.reactions ?? {};

  if (ctx.spy(threadReactionsAction.statusesAtom).isPending) {
    return <ThreadReactionsSkeleton />
  }

  return (
    <div className="flex items-center w-fit gap-2">
      {Object.keys(threadReactions).map((emoji) => {
        const count = threadReactions[emoji];
        const isPressed = userReactions.reactions.includes(emoji) ? true : false;
        const icon = REACTIONS[emoji];

        return (
          <ReactionItem
            key={emoji}
            targetId={threadId}
            isPressed={isPressed}
            emoji={emoji}
            count={count}
            icon={icon}
          />
        );
      })}
    </div>
  )
}, "ThreadReactions")