import { addThreadReactionAction } from "#components/thread/components/thread-reactions/models/thread-reactions.model";
import { spawn } from "@reatom/framework";
import { reatomComponent } from "@reatom/npm-react";
import { REACTIONS } from "@repo/shared/constants/emojis";
import { ContextMenuItem } from "@repo/ui/src/components/context-menu";
import React, { useRef } from "react";

type ThreadReactionsAvailable = {
  id: string
}

export const ThreadReactionsAvailable = reatomComponent<ThreadReactionsAvailable>(({
  ctx, id
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const handleAddReaction = (emoji: string) => {
    void spawn(ctx, async (spawnCtx) => addThreadReactionAction(spawnCtx, { emoji, id }))
  }

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
      {Object.entries(REACTIONS).map(([key, value]) => (
        <ContextMenuItem key={key} onClick={() => handleAddReaction(key)} className="!p-0">
          <div
            className="flex rounded-md hover:scale-[1.2] text-[20px] hover:duration-150
              duration-150 ease-in-out cursor-pointer p-1 items-center justify-center"
          >
            {value}
          </div>
        </ContextMenuItem>
      ))}
    </div>
  )
}, "AvailableThreadReactions")