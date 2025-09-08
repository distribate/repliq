import { threadParamAtom } from "#components/thread/models/thread.model";
import { reatomComponent } from "@reatom/npm-react";
import { IconBookmark, IconBookmarkFilled } from "@tabler/icons-react";
import { saveThreadAction } from "../models/thread-save.model";

export const ThreadSave = reatomComponent<{ isMarked: boolean }>(({ ctx, isMarked }) => {
  const threadId = ctx.get(threadParamAtom)
  if (!threadId) return;

  const isPending = ctx.spy(saveThreadAction.statusesAtom).isPending

  const handle = () => {
    if (isPending) return;

    saveThreadAction(ctx, threadId, isMarked ? "unsave" : "save")
  }

  return (
    <div
      data-state={isPending ? "active" : "inactive"}
      onClick={handle}
      className="flex items-center rounded-lg h-full cursor-pointer py-2 px-4 hover:bg-shark-700 bg-shark-800 overflow-hidden 
        data-[state=active]:cursor-not-allowed data-[state=active]:opacity-75"
    >
      {isMarked ? (
        <IconBookmarkFilled size={20} className="text-shark-50" />
      ) : (
        <IconBookmark size={20} className="text-shark-300" />
      )}
    </div>
  );
}, "ThreadSave")