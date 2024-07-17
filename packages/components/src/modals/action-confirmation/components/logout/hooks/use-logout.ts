import { deleteSession } from "@repo/lib/actions/delete-session.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const LOGOUT_MUTATION_KEY = ["logout-state"]

export const useLogout = () => {
	const queryClient = useQueryClient();
	
	const logOut = useMutation({
		mutationKey: LOGOUT_MUTATION_KEY,
		mutationFn: async() => {
			await deleteSession();
		},
		onSuccess: async (data) => {
			await queryClient.resetQueries();
		},
		onError: (e) => {
			console.log(e);
			throw e;
		}
	})
	
	return { logOut }
}