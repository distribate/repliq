import { QueryKey, useQuery } from "@tanstack/react-query";

export type SkinAnimation = "idle" | "run" | "flying"

export type SkinStateQuery = {
	animation?: SkinAnimation,
	rotate?: boolean
}

export const SKIN_STATE_QUERY_KEY: QueryKey = ["ui", "skin-state"];

const initial: SkinStateQuery = {
	animation: "idle",
	rotate: false
}

export const useSkinStateQuery = () => {
	return useQuery<SkinStateQuery, Error>({
		queryKey: SKIN_STATE_QUERY_KEY,
		initialData: initial,
		refetchOnWindowFocus: false,
		gcTime: Infinity,
		staleTime: Infinity
	})
}