import { QueryKey, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const FRIENDS_SORT_QUERY_KEY: QueryKey = [ "friends-sort-state" ];

export type FriendsSort = "created_at"
	// | "donate"

type FriendsSortQuery = {
	type?: FriendsSort,
	search?: string
}

const initial: FriendsSortQuery = {
	type: "created_at"
}

export const friendsSortQuery = () => {
	return useQuery<FriendsSortQuery>({
		queryKey: FRIENDS_SORT_QUERY_KEY,
		staleTime: Infinity,
		gcTime: Infinity,
		initialData: initial,
	})
}

export const useFriendsSort = () => {
	const queryClient = useQueryClient();
	
	const setFriendsSortMUtation = useMutation({
		mutationFn: async(value: FriendsSortQuery) => {
			queryClient.setQueryData(
				FRIENDS_SORT_QUERY_KEY,
				(prev: FriendsSortQuery) => {
					return {
						...prev,
						...value
					}
				}
			)
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: FRIENDS_SORT_QUERY_KEY
			})
		},
		onError: (e) => {
			throw e;
		}
	})
	
	return { setFriendsSortMUtation }
}