import { Typography } from "@repo/ui/src/components/typography.tsx";
import { useThreadReaction } from "../hooks/use-thread-reaction";

type RatingActionItemProps = {
  emoji: string;
  reactionCount: number;
  threadId: string;
  isLiked: string | false;
  Icon: JSX.Element | string;
};

export const ThreadReactionItem = ({
  emoji, reactionCount, threadId, isLiked, Icon
}: RatingActionItemProps) => {
  const { addReactionToThreadMutation } = useThreadReaction();

  return (
    <div
      onClick={() => addReactionToThreadMutation.mutate({ emoji, id: threadId })}
      className={`flex bg-shark-700/50 rounded-md py-1 items-center gap-1 px-2 group *:transition-all *:duration-150 group cursor-pointer`}
    >
      {typeof Icon === "string" ? (
        <span className="text-shark-50">
          {Icon}
        </span>
      ) : (
        <span className={`text-shark-300 ${isLiked === "fill" ? "fill-current text-primary" : ""}`}>
          {Icon}
        </span>
      )}
      <Typography className="text-shark-50">
        {reactionCount}
      </Typography>
    </div>
  );
};