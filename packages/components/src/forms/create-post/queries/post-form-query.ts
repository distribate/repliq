import { QueryKey, useQuery } from "@tanstack/react-query";

export type VisibilityPost = "only" | "all" | "friends"

export type CreatePostFieldType = Partial<{
	active: boolean,
	length: number,
	visibility: VisibilityPost,
	content: string,
}>

const initial: CreatePostFieldType = {
	active: false,
	length: 0,
	visibility: "all"
}

export const POST_FORM_FIELD_QUERY_KEY: QueryKey = ["ui", "create-post-field"];

export const postFormQuery = () => {
	return useQuery<CreatePostFieldType, Error>({
		queryKey: POST_FORM_FIELD_QUERY_KEY,
		staleTime: Infinity,
		initialData: initial,
		gcTime: Infinity,
		refetchOnWindowFocus: false
	})
}