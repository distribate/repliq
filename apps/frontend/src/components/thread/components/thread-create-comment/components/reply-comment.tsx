import { Reply } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { createThreadCommentRepliedAtom, createThreadCommentTypeAtom } from "#components/thread/components/thread-create-comment/models/thread-comment.model";
import { reatomComponent } from "@reatom/npm-react";
import { IconX } from "@tabler/icons-react";

export const ReplyComment = reatomComponent(({ ctx }) => {
  const repliedValues = ctx.spy(createThreadCommentRepliedAtom)
  const type = ctx.spy(createThreadCommentTypeAtom)

  if (type === "single" || !repliedValues) {
    return null;
  }

  const { commentNickname, commentContent } = repliedValues;

  const handle = () => {
    createThreadCommentTypeAtom(ctx, "single")
    createThreadCommentRepliedAtom.reset(ctx);
  }

  return (
    <div className="flex relative items-center gap-4 rounded-t-md bg-secondary-color px-4 py-2 w-full">
      <Reply size={26} />
      <div className="flex flex-col items-start">
        <Typography textSize="small">
          Ответить {commentNickname}
        </Typography>
        <div className="flex max-w-[120px]">
          <Typography className="text-shark-300 truncate">
            {commentContent}
          </Typography>
        </div>
      </div>
      <IconX
        size={24}
        className="absolute right-4 top-1/2 hover:text-shark-300 -translate-y-1/2"
        onClick={handle}
      />
    </div>
  );
}, "ReplyComment")