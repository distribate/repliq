import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DIALOG_STATE_QUERY_KEY } from '../queries/dialog-params-query.ts';

export const useDialog = () => {
  const qc = useQueryClient();

  const removeDialogMutation = useMutation({
    mutationFn: async (dialogName: string | string[]) => {
      const currDialog = qc.getQueryData<string[]>(DIALOG_STATE_QUERY_KEY) || [];
      
      if (!dialogName) return;
      
      console.log(`Removing dialog: ${dialogName}`);
      
      const updatedDialog = typeof dialogName === 'string'
        ? currDialog.filter(dgs => dgs !== dialogName)
        : currDialog.filter(dgs => !new Set(dialogName).has(dgs));
      
      return qc.setQueryData(
        DIALOG_STATE_QUERY_KEY,
        updatedDialog
      );
    },
    onSuccess: async (data, variables, context) => {
      console.log(`Dialog removed successfully: ${variables}`);
      await qc.invalidateQueries({ queryKey: DIALOG_STATE_QUERY_KEY });
    },
    onError: (e) => {
      console.error(`Error removing dialog: ${e.message}`);
      throw new Error(e.message);
    },
  });
  
  const setDialogIdMutation = useMutation({
    mutationFn: async (dialogName: string) => {
      const currDialog = qc.getQueryData<string[]>(DIALOG_STATE_QUERY_KEY) || [];
      
      if (!currDialog.includes(dialogName)) {
        return qc.setQueryData(
          DIALOG_STATE_QUERY_KEY,
          [...currDialog, dialogName]
        );
      }
    },
    onSuccess: async () => await qc.invalidateQueries({ queryKey: DIALOG_STATE_QUERY_KEY }),
    onError: (e) => { throw new Error(e.message); },
  });
  
  return { setDialogIdMutation, removeDialogMutation };
};