import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SKIN_ANIMATION_QUERY_KEY, SkinStateQuery } from "../queries/skin-query.ts";

export const useSkinStateChange = () => {
	const qc = useQueryClient();
	
	const updateSkinStateMutation = useMutation({
		mutationFn: async(values: Omit<SkinStateQuery, "skinUrl">) => {
			qc.setQueryData(SKIN_ANIMATION_QUERY_KEY,
				(prev: Omit<SkinStateQuery, "skinUrl">) => {
				return { ...prev, ...values }
			})
		},
		onSuccess: async() => await qc.invalidateQueries({ queryKey: SKIN_ANIMATION_QUERY_KEY }),
		onError: (e) => { throw new Error(e.message) }
	})
	
	return { updateSkinStateMutation }
}