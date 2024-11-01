import { Typography } from "@repo/ui/src/components/typography.tsx";
import { ThreadHistory } from '#thread/components/saved-thread/components/thread-history.tsx';
import { useHistoryThreads } from '#thread/components/saved-thread/hooks/use-history-threads.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { useSidebarControl } from '../../sidebar-layout/hooks/use-sidebar-control.ts';

export const HistoryThreads = () => {
	const { savedThreads } = useHistoryThreads();
	const { isCompact, isExpanded } = useSidebarControl()
	
	if (!savedThreads.length) return null;
	
	const savedThreadsHeight = isCompact || !isExpanded ? 260 : 150;
	
	return (
		<>
			<div
				className={`flex flex-col gap-y-2 overflow-y-auto overflow-x-hidden max-h-[${savedThreadsHeight}px] w-full`}>
				{isCompact || !isExpanded ? (
					<div className="flex flex-col gap-y-2 w-full">
						{savedThreads.reverse().map((thread, i) => (
							<ThreadHistory
								index={i}
								type="compact"
								key={thread.threadId}
								id={thread.id}
								threadId={thread.threadId}
								title={thread.title}
								nickname={thread.nickname}
							/>
						))}
					</div>
				) : (
					<>
						<Typography textSize="medium" textColor="shark_white">
							Последнее просмотренное
						</Typography>
						<div className="flex flex-col gap-y-2 w-full">
							{savedThreads.reverse().map(thread => (
								<ThreadHistory type="full" key={thread.threadId} {...thread} />
							))}
						</div>
					</>
				)}
			</div>
			<Separator orientation="horizontal"/>
		</>
	)
}