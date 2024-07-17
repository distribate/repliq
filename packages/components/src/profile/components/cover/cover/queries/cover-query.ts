import { QueryKey, useQuery } from "@tanstack/react-query";

export const COVER_QUERY_KEY: QueryKey = [ "ui", "cover-state" ]

export type CoverQuery = {
	inView: boolean,
	entry?: IntersectionObserverEntry
}

export const coverInitial: CoverQuery = {
	inView: true
}

export const coverQuery = () => {
	return useQuery({
		queryKey: COVER_QUERY_KEY,
		initialData: coverInitial,
		staleTime: Infinity,
		gcTime: Infinity,
		refetchOnWindowFocus: false
	})
}