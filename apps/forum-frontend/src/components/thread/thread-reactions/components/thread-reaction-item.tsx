import { Typography } from "@repo/ui/src/components/typography.tsx";
import { addReactionAction } from "../models/thread-reactions.model";
import { reatomComponent } from "@reatom/npm-react";

type RatingActionItemProps = {
  emoji: string;
  reactionCount: number;
  threadId: string;
  isLiked: boolean
  Icon: JSX.Element | string;
};

export const ThreadReactionItem = reatomComponent<RatingActionItemProps>(({
  ctx, emoji, reactionCount, threadId, isLiked, Icon
}) => {
  return (
    <div
      onClick={() => addReactionAction(ctx, { emoji, id: threadId })}
      className={`flex ${isLiked ? "bg-shark-400/50" : "bg-shark-700/50"} 
        rounded-md py-1 cursor-pointer items-center gap-1 px-2 group *:transition-all *:duration-150 group`}
    >
      {typeof Icon === "string" ? (
        <span className="text-shark-50">
          {Icon}
        </span>
      ) : (
        <span className="text-shark-300">
          {Icon}
        </span>
      )}
      <Typography className="text-shark-50">
        {reactionCount}
      </Typography>
    </div>
  );
}, "ThreadReactionItem")