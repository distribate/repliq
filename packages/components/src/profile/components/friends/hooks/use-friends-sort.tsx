import { QueryKey, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const FRIENDS_SORT_QUERY_KEY: QueryKey = [ "friends-sort-state" ];

export type FriendsSort = "created_at" | "donate"

type FriendsSortQuery = Partial<{
	type: FriendsSort,
	search: string
}>

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
	const qc = useQueryClient();
	
	const setFriendsSortMUtation = useMutation({
		mutationFn: async(value: FriendsSortQuery) => {
			qc.setQueryData(FRIENDS_SORT_QUERY_KEY,
				(prev: FriendsSortQuery) => {
					return { ...prev, ...value }
				}
			)
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: FRIENDS_SORT_QUERY_KEY }),
		onError: e => { throw new Error(e.message) }
	})
	
	return { setFriendsSortMUtation }
}