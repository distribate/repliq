import type { DefaultError } from "@tanstack/query-core";
import type { UseMutationOptions } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query"

export function mutationOptions<
	TData = unknown,
	TError = DefaultError,
	TVariables = void,
	TContext = unknown,
>(
	options: UseMutationOptions<TData, TError, TVariables, TContext>,
): UseMutationOptions<TData, TError, TVariables, TContext> {
	const qc = useQueryClient();
	
	return {
		onMutate: (variables) => {
			let _mutationKey = "";
			
			// Object containing the maximum number of allowed mutations for each query key.
			// If a query key is not present, it defaults to 1 (only one mutation at a time)
			const maxConcurrentMutations = {
				["foo"]: 1,
			};
			
			// Get the mutation count for the current mutation
			const currentMutationCount = qc.isMutating({
				// Find all mutations that match the current mutation
				predicate(mutation) {
					_mutationKey = JSON.stringify(mutation.options.mutationKey);
					// because the variables are objects, we need to use a deep comparison
					return mutation.state.variables === variables;
				},
				// make a strict comparison
				exact: true,
				status: "pending"
			});
			
			// If the mutation count is greater than its allowed count, it means that there is already a mutation
			// in flight for the same input. In that case, we reject the mutation
			if (currentMutationCount > 1) {
				return Promise.reject();
			}
		},
		...options,
	};
}