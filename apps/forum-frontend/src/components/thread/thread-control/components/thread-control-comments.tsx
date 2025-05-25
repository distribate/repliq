import { MessageCircle, MessageCircleOff } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Toggle } from "@repo/ui/src/components/toggle.tsx";
import { useState } from "react";
import { reatomComponent } from "@reatom/npm-react";
import { threadControlAtom } from "../models/thread-control.model";

export const ThreadControlComments = reatomComponent<{ is_comments: boolean }>(({
  ctx, is_comments: currentIsComments,
}) => {
  const [commentsValue, setCommentsValue] = useState<boolean>(currentIsComments);

  const handleToggleThreadComments = () => {
    setCommentsValue((prev) => !prev);
    threadControlAtom(ctx, (state) => ({ ...state, values: { is_comments: !commentsValue } }))
  };

  return (
    <div className="flex flex-col items-start gap-2 w-full">
      <Typography textColor="gray">Комментарование треда</Typography>
      <Toggle
        variant="outline"
        pressed={commentsValue}
        onPressedChange={handleToggleThreadComments}
        aria-label="Комментирование"
      >
        {!currentIsComments ? (
          <MessageCircleOff size={20} className="text-red-500" />
        ) : (
          <MessageCircle size={20} className="text-green-500" />
        )}
      </Toggle>
    </div>
  );
}, "ThreadControlComments")