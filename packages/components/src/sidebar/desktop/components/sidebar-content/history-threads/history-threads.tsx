import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { useSidebarControl } from "../../sidebar-layout/hooks/use-sidebar-control.ts";
import { historyThreadsQuery } from "#thread/components/saved-thread/queries/history-threads-query.ts";
import { ThreadHistory } from "#thread/components/saved-thread/components/thread-history.tsx";

export const HistoryThreads = () => {
  const { isCompact, isExpanded } = useSidebarControl();
  const { data: savedThreads } = historyThreadsQuery();
  if (!savedThreads) return null;

  const savedThreadsHeight = isCompact || !isExpanded ? 260 : 150;

  return (
    <>
      <div className={`flex flex-col gap-y-2 overflow-y-auto overflow-x-hidden max-h-[${savedThreadsHeight}px] w-full`}>
        {(!isCompact && isExpanded) && (
          <Typography textSize="medium" textColor="shark_white">
            Последнее просмотренное
          </Typography>
        )}
        <div className="flex flex-col gap-y-2 w-full">
          {savedThreads.reverse().map((thread, i) => (
            <ThreadHistory index={i} key={i} {...thread} />
          ))}
        </div>
      </div>
      <Separator orientation="horizontal" />
    </>
  );
};