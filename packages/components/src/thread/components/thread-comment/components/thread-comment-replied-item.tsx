import { Separator } from "@repo/ui/src/components/separator.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { ThreadCommentProps } from "../types/thread-comment-types.ts";
import { useHighlight } from "../hooks/use-highlight.ts";
import Link from "next/link";

type ThreadRepliedCommentItemProps = {
  replied: NonNullable<ThreadCommentProps["replied"]>;
};

export const ThreadRepliedCommentItem = ({
  replied,
}: ThreadRepliedCommentItemProps) => {
  const { selectItem } = useHighlight(replied.id);

  const repliedMessage =
    replied.content.length >= 28
      ? replied.content.slice(0, 28) + "..."
      : replied.content;

  return (
    <Link
      href={`#${replied.id}`}
      className="w-fit"
      onClick={() => selectItem()}
    >
      <div className="flex items-center gap-1 cursor-pointer w-fit">
        <Separator className="w-[3px] !h-[42px]" orientation="vertical" />
        <div className="flex flex-col bg-secondary-color rounded-md min-w-[120px] overflow-hidden w-fit max-w-[300px] py-1 px-2 border border-shark-900">
          <Typography>{replied.user_nickname}</Typography>
          <Typography textColor="gray">{repliedMessage}</Typography>
        </div>
      </div>
    </Link>
  );
};
