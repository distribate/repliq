import { X } from "lucide-react";
import { Avatar } from "#user/components/avatar/components/avatar.tsx";
import Link from "next/link";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { useHistoryThreads } from "../hooks/use-history-threads.tsx";
import { ThreadHistoryType } from "../types/thread-history-types.ts";
import { HoverCardWrapper } from "#wrappers/hover-card-wrapper.tsx";
import { THREAD_URL } from "@repo/shared/constants/routes.ts";
import { useSidebarControl } from "#sidebar/desktop/components/sidebar-layout/hooks/use-sidebar-control.ts";

export type ThreadHistoryProps = {
  index?: number;
} & ThreadHistoryType;

const ThreadHistoryCompact = ({
  threadId,
  id,
  title,
  nickname,
}: Omit<ThreadHistoryProps, "index">) => {
  const { deleteThread } = useHistoryThreads();

  return (
    <div className="flex flex-col gap-y-1 relative">
      <div
        onClick={() => deleteThread(threadId)}
        className="absolute top-1 right-1 cursor-pointer hover:opacity-50"
      >
        <X className="w-3 h-3 hover:text-red-500" />
      </div>
      <Link href={THREAD_URL + threadId}>
        <Typography textSize="small" textColor="shark_white">
          {title}
        </Typography>
      </Link>
      <Typography className="text-[12px] text-shark-300">
        Игрок: {nickname}
      </Typography>
    </div>
  );
};

const ThreadHistoryFull = ({
  threadId, nickname, id, title,
}: Omit<ThreadHistoryProps, "index">) => {
  const { deleteThread } = useHistoryThreads();

  return (
    <div className="flex gap-1 relative items-center bg-shark-800 rounded-md p-2 w-full">
      <div
       onClick={() => deleteThread(threadId)}
        className="absolute top-2 right-2 cursor-pointer hover:opacity-50"
      >
        <X className="w-3 h-3 hover:text-red-500" />
      </div>
      <Avatar
        nickname={nickname}
        className="min-h-[30px] min-w-[30px] max-w-[30px] max-h-[30px]"
        propHeight={30}
        propWidth={30}
      />
      <div className="flex flex-col w-full truncate overflow-hidden">
        <Link href={THREAD_URL + threadId}>
          <Typography
            textSize="small"
            textColor="shark_white"
            className="truncate"
          >
            {title}
          </Typography>
        </Link>
        <Typography className="text-[12px] leading-3 text-shark-300">
          {nickname}
        </Typography>
      </div>
    </div>
  );
};

export const ThreadHistory = ({
  id, nickname, title, index, threadId
}: ThreadHistoryProps) => {
  const { isCompact, isExpanded } = useSidebarControl();

  return (isCompact || !isExpanded) ? (
    <HoverCardWrapper
      properties={{ sideAlign: "right", contentAlign: "start" }}
      trigger={
        <div className="flex relative bg-shark-800 h-[50px] w-[50px] rounded-md p-1">
          <Avatar nickname={nickname} propHeight={32} propWidth={32} />
          <div className="absolute bottom-0 -right-2 rounded-md h-[20px] w-[20px]">
            <Typography className="text-sm text-shark-300 font-[Minecraft]">
              {index}
            </Typography>
          </div>
        </div>
      }
      content={<ThreadHistoryCompact id={id} threadId={threadId} title={title} nickname={nickname} />}
    />
  ) : <ThreadHistoryFull id={id} threadId={threadId} title={title} nickname={nickname} />
};