import type { DefaultError } from "@tanstack/query-core";
import type { UseMutationOptions } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query"

export function mutationOptions<
	TData = unknown, TError = DefaultError, TVariables = void, TContext = unknown,
>(
	options: UseMutationOptions<TData, TError, TVariables, TContext>,
): UseMutationOptions<TData, TError, TVariables, TContext> {
	const qc = useQueryClient();
	
	return {
		onMutate: (variables) => {
			let _mutationKey = "";
			
			const currentMutationCount = qc.isMutating({
				predicate(mutation) {
					_mutationKey = JSON.stringify(mutation.options.mutationKey);
					return mutation.state.variables === variables;
				},
				exact: true,
				status: "pending"
			});
			
			if (currentMutationCount > 1) {
				return Promise.reject();
			}
		},
		...options,
	};
}