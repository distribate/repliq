import { useMutation, useQueryClient } from "@tanstack/react-query";
import { COVER_QUERY_KEY, CoverQuery } from "../queries/cover-query.ts";

export const useCover = () => {
	const qc = useQueryClient();
	
	const setCoverStateMutation = useMutation({
		mutationFn: async (values: CoverQuery) => {
			return qc.setQueryData(COVER_QUERY_KEY,
				(prev: CoverQuery) => ({ ...prev, ...values })
			)
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: COVER_QUERY_KEY }),
		onError: e => { throw new Error(e.message)}
	})
	
	return { setCoverStateMutation }
}