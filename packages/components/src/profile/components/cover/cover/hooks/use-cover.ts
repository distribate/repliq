import { useMutation, useQueryClient } from "@tanstack/react-query";
import { COVER_QUERY_KEY, CoverQuery } from "../queries/cover-query.ts";

export const useCover = () => {
	const qc = useQueryClient();
	
	const setCoverStateMutation = useMutation({
		mutationFn: async (values: CoverQuery) => {
			qc.setQueryData(COVER_QUERY_KEY, (prev: CoverQuery) => {
				return { ...prev, ...values }
			})
		},
		onSuccess: async () => await qc.invalidateQueries({ queryKey: COVER_QUERY_KEY })
	})
	
	return { setCoverStateMutation }
}