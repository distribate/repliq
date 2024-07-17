import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DIALOG_STATE_QUERY_KEY, DialogParamsQuery } from "../queries/dialog-params-query.ts";

type Dialog = {
	dialogName: string;
}

export const useDialog = () => {
	const qc = useQueryClient();
	
	const data = qc.getQueryData<DialogParamsQuery[]>(
		DIALOG_STATE_QUERY_KEY
	);
	
	const opened = Date.now()
	
	const removeDialogMutation = useMutation({
		mutationFn: async({
			dialogName
		}: Dialog) => {
			if (!data) return;

			const newData = data.filter(
				item => item.id !== dialogName
			);
			
			qc.setQueryData(DIALOG_STATE_QUERY_KEY, newData)
		},
		onSuccess: async() => {
			await qc.invalidateQueries({ queryKey: DIALOG_STATE_QUERY_KEY })
		},
		onError: (e) => { throw new Error(e.message) }
	})
	
	const setDialogIdMutation = useMutation({
		mutationFn: async({ dialogName }: Dialog) => {
			if (!dialogName) return;
			
			qc.setQueryData(
				DIALOG_STATE_QUERY_KEY, (prev: DialogParamsQuery[]) => {
					
					const newObject = {
						id: dialogName, opened: opened
					};
					
					return [ ...prev, newObject ]
				}
			)
		},
		onSuccess: async() => {
			await qc.invalidateQueries({ queryKey: DIALOG_STATE_QUERY_KEY })
		},
		onError: (e) => { throw new Error(e.message) }
	})
	
	return { setDialogIdMutation, removeDialogMutation }
}