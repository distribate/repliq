import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SKIN_STATE_QUERY_KEY, SkinStateQuery } from "../queries/skin-query.ts";

export const useSkinStateChange = () => {
	const qc = useQueryClient();
	
	const updateSkinStateMutation = useMutation({
		mutationFn: async(values: SkinStateQuery) => {
			qc.setQueryData(SKIN_STATE_QUERY_KEY, (prev: SkinStateQuery) => {
				return { ...prev, ...values }
			})
		},
		onSuccess: async() => {
			await qc.invalidateQueries({
				queryKey: SKIN_STATE_QUERY_KEY
			})
		},
		onError: (e) => { throw new Error(e.message) }
	})
	
	return { updateSkinStateMutation }
}