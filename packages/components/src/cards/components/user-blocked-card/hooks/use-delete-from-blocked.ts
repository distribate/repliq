import { useMutation, useQueryClient } from "@tanstack/react-query";
import { USER_BLOCKED_QUERY_KEY } from "../../user-personal-card/components/account-settings/queries/user-blocked-query.ts";
import {
  deleteUserFromBlocked,
  DeleteUserFromBlocked,
} from "../queries/delete-user-from-blocked.ts";
import { getUser } from "@repo/lib/helpers/get-user.ts";

export const useDeleteFromBlocked = () => {
  const qc = useQueryClient();
  const { nickname } = getUser();

  const deleteUserFromBlockedMutation = useMutation({
    mutationFn: async (
      values: Pick<DeleteUserFromBlocked, "targetUserNickname">,
    ) => {
      if (!values) return;

      return await deleteUserFromBlocked({
        targetUserNickname: values.targetUserNickname,
        currentUserNickname: nickname,
      });
    },
    onSuccess: async (data) => {
      if (!data) return;
      
      await qc.invalidateQueries({
        queryKey: USER_BLOCKED_QUERY_KEY(nickname),
      });
    },
    onError: e => { throw new Error(e.message) },
  });

  return { deleteUserFromBlockedMutation };
};