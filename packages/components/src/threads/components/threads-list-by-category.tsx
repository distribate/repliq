import { THREAD } from "@repo/types/entities/entities-type.ts"
import { ThreadCard } from "../../thread/components/thread-card/components/thread-card.tsx";

type ThreadsListByCategoryProps = {
	threadsList: THREAD[] | null
}

export const ThreadsListByCategory = ({
	threadsList
}: ThreadsListByCategoryProps) => {
	
	if (!threadsList) return null;
	
	return (
		threadsList.map(thread => (
			<ThreadCard key={thread.id}/>
		))
	)
}