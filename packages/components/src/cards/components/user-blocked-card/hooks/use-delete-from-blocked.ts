import { useMutation, useQueryClient } from "@tanstack/react-query";
import { USER_BLOCKED_QUERY_KEY } from "../../user-personal-card/components/account-settings/queries/user-blocked-query.ts";
import {
  deleteUserFromBlocked,
} from "../queries/delete-user-from-blocked.ts";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { useRouter } from "@tanstack/react-router";

export const useDeleteFromBlocked = () => {
  const qc = useQueryClient();
  const { nickname } = getUser();
  const { invalidate } = useRouter()

  const deleteUserFromBlockedMutation = useMutation({
    mutationFn: async (recipient: string) => deleteUserFromBlocked({ recipient }),
    onSuccess: async (data, variables) => {
      if (!data) return;

      const blockedUsers = qc.getQueryData<{ nickname: string }[]>(USER_BLOCKED_QUERY_KEY(nickname));
      if (!blockedUsers) return;

      // variables = recipient's nickname
      const updatedBlockedUsers = blockedUsers.filter(user => user.nickname !== variables);

      if (updatedBlockedUsers.length <= 1) {
        return qc.setQueryData(USER_BLOCKED_QUERY_KEY(nickname), null);
      }

      invalidate()

      return qc.setQueryData(USER_BLOCKED_QUERY_KEY(nickname), updatedBlockedUsers);
    },
    onError: e => { throw new Error(e.message) },
  });

  return { deleteUserFromBlockedMutation };
};