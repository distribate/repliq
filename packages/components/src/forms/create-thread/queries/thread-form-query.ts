import { useQuery } from "@tanstack/react-query";
import { THREAD } from "@repo/types/entities/entities-type"

export const THREAD_FORM_QUERY = ["ui", "thread-form"];

export type ThreadFormQuery = Partial<{
	formState: Partial<{
		error: string | null,
		status: number | null
	}>,
	values: Partial<
		Omit<THREAD, "id" | "created_at" | "content" | "updated_at">
	> & Partial<{
		category_id: number,
		auto_remove_time: string,
		permission_cost: string,
		tags: Array<string>,
		content: any
 	}>
}>

const initial: ThreadFormQuery = {
	formState: {
		error: null,
		status: null,
	},
	values: {
		permission: false,
		auto_remove: false,
		comments: true,
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