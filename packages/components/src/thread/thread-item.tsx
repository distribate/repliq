import { getThread, ThreadModel } from "./queries/get-thread.ts";
import { ThreadByCategoryItem } from "./components/thread-card-category/thread-by-category-item.tsx";
import { ThreadLayout } from "./components/thread-layout/components/thread-layout.tsx";

export const ThreadItem = async({
	id
}: Pick<ThreadModel, "id">) => {
	const thread = await getThread({
		type: "all", id: id
	})
	
	if (!thread) return null;
	
	const { nickname, title, nicknameColor } = thread;
	
	if (!nickname || !nicknameColor) return;
	
	return (
		<ThreadLayout id={id} title={title} nickname={nickname}>
			<ThreadByCategoryItem {...thread}/>
		</ThreadLayout>
	)
}