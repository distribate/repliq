import { Typography } from "@repo/ui/src/components/typography.tsx";
import { addThreadReactionAction } from "../../components/thread/components/thread-reactions/models/thread-reactions.model";
import { reatomComponent } from "@reatom/npm-react";
import { JSX } from "react";

type RatingActionItemProps = {
  targetId: string;
  emoji: string;
  isPressed: boolean
  count: number;
  icon: JSX.Element | string;
};

export const ReactionItem = reatomComponent<RatingActionItemProps>(({
  ctx, emoji, count, targetId, isPressed, icon: Icon
}) => {
  const handle = () => addThreadReactionAction(ctx, { emoji, id: targetId })

  return (
    <div
      data-pressed={isPressed}
      onClick={handle}
      className="flex data-[pressed=true]:bg-shark-400/50 data-[pressed=false]:bg-shark-700/50 
        rounded-md py-1 cursor-pointer items-center gap-1 px-2 group *:transition-all *:duration-150 group"
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
        {count}
      </Typography>
    </div>
  );
}, "ReactionItem")