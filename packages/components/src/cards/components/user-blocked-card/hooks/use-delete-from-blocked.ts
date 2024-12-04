import { useMutation, useQueryClient } from "@tanstack/react-query";
import { USER_BLOCKED_QUERY_KEY } from "../../user-personal-card/components/account-settings/queries/user-blocked-query.ts";
import {
  deleteUserFromBlocked,
  DeleteUserFromBlocked,
} from "../queries/delete-user-from-blocked.ts";
import { getUser } from "@repo/lib/helpers/get-user.ts";

export const useDeleteFromBlocked = () => {
  const qc = useQueryClient();
  const currentUser = getUser();

  const deleteUserFromBlockedMutation = useMutation({
    mutationFn: async (
      values: Pick<DeleteUserFromBlocked, "targetUserNickname">,
    ) => {
      if (!values) return;

      return await deleteUserFromBlocked({
        targetUserNickname: values.targetUserNickname,
        currentUserNickname: currentUser.nickname,
      });
    },
    onSuccess: async (data, variables, context) => {
      if (!data) return;
      await qc.invalidateQueries({
        queryKey: USER_BLOCKED_QUERY_KEY(currentUser.nickname),
      });
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  return { deleteUserFromBlockedMutation };
};
