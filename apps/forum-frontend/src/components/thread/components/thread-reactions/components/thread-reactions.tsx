import { ThreadEntity } from "@repo/types/entities/entities-type.ts";
import { THREAD_REACTIONS } from "@repo/shared/constants/emojis.tsx";
import { threadReactionsQuery } from "../queries/thread-reactions-query";
import { ThreadReactionsSkeleton } from "./thread-reactions-skeleton";
import { ThreadReactionItem } from "./thread-reaction-item";

type ThreadRatingProps = {
  threadId: Pick<ThreadEntity, "id">["id"];
};

export const ThreadReactions = ({ threadId }: ThreadRatingProps) => {
  const { data, isLoading } = threadReactionsQuery(threadId);

  if (isLoading) return <ThreadReactionsSkeleton />;

  if (!threadId || !data) return null;

  const userReactions = data.userReactions ?? { reactions: [] };
  const threadReactions = data.threadReactions.reactions ?? { };

  return (
    <div className="flex items-center w-fit gap-2">
      {Object.keys(threadReactions).map((emojiName) => {
        const count = threadReactions[emojiName];
        const isLiked = userReactions.reactions.includes(emojiName) ? true : false;

        const Icon = THREAD_REACTIONS[emojiName];

        return (
          <ThreadReactionItem
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
};