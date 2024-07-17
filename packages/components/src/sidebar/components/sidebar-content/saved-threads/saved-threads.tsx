import { Typography } from "@repo/ui/src/components/typography.tsx";
import { useSidebarControl } from "../../sidebar-layout/hooks/use-sidebar-control.ts";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { SavedThread } from "../../../../thread/components/saved-thread/components/saved-thread.tsx";
import { useSaveLastThread } from "../../../../thread/components/saved-thread/hooks/use-save-last-thread.tsx";

export const SavedThreads = () => {
	const { savedTopics } = useSaveLastThread();
	const { isCompact, isExpanded } = useSidebarControl()
	
	if (!savedTopics.length) return null;
	
	const savedThreadsHeight = isCompact || !isExpanded ? 260 : 150;
	
	return (
		<>
			<div
				className={`flex flex-col gap-y-2 overflow-y-scroll overflow-x-hidden max-h-[${savedThreadsHeight}px] w-full`}>
				{isCompact || !isExpanded ? (
					<div className="flex flex-col gap-y-2 w-full">
						{savedTopics.reverse().map((thread, i) => (
							<SavedThread index={i} type="compact" key={thread.id} {...thread} />
						))}
					</div>
				) : (
					<>
						<Typography textSize="medium" textColor="shark_white">
							Последнее просмотренное
						</Typography>
						<div className="flex flex-col gap-y-2 w-full">
							{savedTopics.reverse().map(thread => <SavedThread type="full" key={thread.id} {...thread} />)}
						</div>
					</>
				)}
			</div>
			<Separator orientation="horizontal"/>
		</>
	)
}