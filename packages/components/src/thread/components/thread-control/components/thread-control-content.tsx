import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { ThreadControlProps } from '../types/thread-control-types.ts';

export const ThreadControlContent = ({
  id: threadId, content: currentContent
}: Pick<ThreadControlProps, "id" | "content">) => {
  return (
    <div className="flex items-center gap-2 w-full">
      <HoverCardItem className="h-10 w-full py-1 px-4">
        <Typography>
          Изменить контент
        </Typography>
      </HoverCardItem>
    </div>
  )
}