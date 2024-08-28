import { useQuery } from "@tanstack/react-query";

export const COVER_QUERY_KEY = [ "ui", "cover-state" ]

export type CoverQuery = {
	inView: boolean,
	entry?: IntersectionObserverEntry
}

export const initial: CoverQuery = {
	inView: true
}

export const coverQuery = () => {
	return useQuery({
		queryKey: COVER_QUERY_KEY,
		initialData: initial,
		staleTime: Infinity,
		gcTime: Infinity,
		refetchOnWindowFocus: false
	})
}