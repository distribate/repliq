import { QueryKey, useQuery } from '@tanstack/react-query';

export const DIALOG_STATE_QUERY_KEY: QueryKey = ["ui", "dialog-state"];

export type DialogParamsQuery = string[];

export const dialogParamsQuery = () => {
	return useQuery<DialogParamsQuery, Error>({
		queryKey: DIALOG_STATE_QUERY_KEY,
		staleTime: Infinity,
		initialData: [],
		gcTime: Infinity,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		retry: 0,
		retryOnMount: false
	})
}