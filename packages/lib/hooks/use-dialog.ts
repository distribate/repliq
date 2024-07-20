import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DIALOG_STATE_QUERY_KEY } from '../queries/dialog-params-query.ts';

type DialogNameType = string | string[];

export const useDialog = () => {
  const qc = useQueryClient();
  
  const removeDialogMutation = useMutation({
    mutationFn: async(dialogName: DialogNameType) => {
      const currentDialogState = qc.getQueryData<string[]>(DIALOG_STATE_QUERY_KEY);
      
      if (!currentDialogState) return;
      
      if (Array.isArray(dialogName)) {
        qc.setQueryData(
          DIALOG_STATE_QUERY_KEY, currentDialogState.filter(item => !dialogName.includes(item))
        );
      } else {
        qc.setQueryData(
          DIALOG_STATE_QUERY_KEY, currentDialogState.filter(item => item !== dialogName)
        )
      }
    },
    onSuccess: async() => await qc.invalidateQueries({ queryKey: DIALOG_STATE_QUERY_KEY }),
    onError: (e) => { throw new Error(e.message) },
  });
  
  const setDialogIdMutation = useMutation({
    mutationFn: async(dialogName: DialogNameType) => {
      if (!dialogName) return;
      
      const currentDialogState = qc.getQueryData<string[]>(DIALOG_STATE_QUERY_KEY) || [];
      
      if (typeof dialogName === 'string' && !currentDialogState.includes(dialogName)) {
        qc.setQueryData(DIALOG_STATE_QUERY_KEY, [...currentDialogState, dialogName]);
      }
    },
    onSuccess: async() => await qc.invalidateQueries({ queryKey: DIALOG_STATE_QUERY_KEY }),
    onError: (e) => { throw new Error(e.message) },
  });
  
  return { setDialogIdMutation, removeDialogMutation };
};