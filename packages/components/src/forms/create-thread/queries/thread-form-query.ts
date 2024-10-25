import { useQuery } from "@tanstack/react-query";
import { ThreadEntity } from "@repo/types/entities/entities-type"

export const THREAD_FORM_QUERY = ["ui", "thread-form"];

export type ThreadFormQuery = Partial<{
	values: Partial<
		Omit<ThreadEntity, "id" | "created_at" | "content" | "updated_at">
	> & Partial<{
		category_id: number,
		auto_remove_time: string,
		permission_cost: string,
		tags: Array<string>,
		content: any,
		previewImages: string[]
 	}>
}>

const initial: ThreadFormQuery = {
	values: {
		permission: false,
		auto_remove: false,
		comments: true,
		visibility: "all"
	}
}

export const threadFormQuery = () => {
	return useQuery({
		queryKey: THREAD_FORM_QUERY,
		staleTime: Infinity,
		gcTime: Infinity,
		initialData: initial,
		refetchOnWindowFocus: false
	})
}