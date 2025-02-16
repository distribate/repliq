import { useThreadReaction } from "#thread/components/thread-reactions/hooks/use-thread-reaction.ts";
import { THREAD_REACTIONS } from "@repo/shared/constants/emojis";
import React, { useRef } from "react";

type AvailableReactionsProps = {
  threadId: string
}

export const AvailableThreadReactions = ({
  threadId
}: AvailableReactionsProps) => {
  const { addReactionToThreadMutation } = useThreadReaction();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const handleAddReaction = (emoji: string) => addReactionToThreadMutation.mutate({ emoji, id: threadId });

  const handleWheel = (e: React.WheelEvent) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <div
      className="flex items-center rounded-md bg-shark-800 gap-2 cursor-default pb-2
       scrollbar-thin scrollbar-shark-700 scrollbar-track-transparent overflow-x-auto max-w-[200px]"
      onWheel={handleWheel}
      ref={scrollRef}
    >
      {Object.entries(THREAD_REACTIONS).map(([key, value]) => (
        <div
          key={key}
          onClick={() => handleAddReaction(key)}
          className="flex rounded-md hover:scale-[1.2] text-[20px] hover:duration-150
           duration-150 ease-in-out cursor-pointer p-1 items-center justify-center"
        >
          {value}
        </div>
      ))}
    </div>
  )
}