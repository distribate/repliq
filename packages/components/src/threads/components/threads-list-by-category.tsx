import { ThreadEntity } from "@repo/types/entities/entities-type.ts"
import { ThreadCard } from "../../thread/components/thread-card/components/thread-card.tsx";

type ThreadsListByCategoryProps = {
	threadsList: ThreadEntity[] | null
}

export const ThreadsListByCategory = ({
	threadsList
}: ThreadsListByCategoryProps) => {
	
	if (!threadsList) return null;
	
	return threadsList.map(thread => <ThreadCard key={thread.id}/>)
}