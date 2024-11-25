import { Typography } from '@repo/ui/src/components/typography.tsx';
import { ThreadHistory, ThreadHistoryProps } from '#thread/components/saved-thread/components/thread-history.tsx';
import { useHistoryThreads } from '#thread/components/saved-thread/hooks/use-history-threads.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { useSidebarControl } from '../../sidebar-layout/hooks/use-sidebar-control.ts';

type HistoryThreadsListProps = Pick<ThreadHistoryProps, 'type'> & {
  withTitle?: boolean
}

const HistoryThreadsList = ({
  type, withTitle = true,
}: HistoryThreadsListProps) => {
  const { savedThreads } = useHistoryThreads();
  if (!savedThreads) return null;
  
  return (
    <>
      {withTitle && (
        <Typography textSize="medium" textColor="shark_white">
          Последнее просмотренное
        </Typography>
      )}
      <div className="flex flex-col gap-y-2 w-full">
        {savedThreads.reverse().map((thread, i) => (
          <ThreadHistory
            index={i}
            key={thread.id}
            type={type}
            {...thread}
          />
        ))}
      </div>
    </>
  );
};

export const HistoryThreads = () => {
  const { isCompact, isExpanded } = useSidebarControl();
  const { savedThreads } = useHistoryThreads();
  if (!savedThreads) return null;
  
  const savedThreadsHeight = isCompact || !isExpanded ? 260 : 150;
  
  return (
    <>
      <div
        className={`flex flex-col gap-y-2 overflow-y-auto overflow-x-hidden max-h-[${savedThreadsHeight}px] w-full`}
      >
        {isCompact || !isExpanded ? (
          <HistoryThreadsList type="compact" withTitle={false} />
        ) : (
          <HistoryThreadsList type="full"/>
        )}
      </div>
      <Separator orientation="horizontal" />
    </>
  );
};