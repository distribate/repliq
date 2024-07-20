import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  USER_BLOCKED_QUERY_KEY
} from '../../user-personal-card/components/account-settings/queries/user-blocked-query.ts';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { deleteUserFromBlocked, DeleteUserFromBlocked } from '../queries/delete-user-from-blocked.ts';

export const useDeleteFromBlocked = () => {
  const qc = useQueryClient();
  const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY)
  
  const deleteUserFromBlockedMutation = useMutation({
    mutationFn: async(values: Pick<DeleteUserFromBlocked, "targetUserNickname">) => {
      if (!values || !currentUser) return;
      
      return await deleteUserFromBlocked({
        targetUserNickname: values.targetUserNickname,
        currentUserNickname: currentUser.nickname
      })
    },
    onSuccess: async (data, variables, context) => {
      if (!currentUser || !data) return;
      await qc.invalidateQueries({ queryKey: USER_BLOCKED_QUERY_KEY(currentUser.nickname), })
    },
    onError: (e) => { throw new Error(e.message) }
  })
  
  return { deleteUserFromBlockedMutation }
};