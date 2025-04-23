import { useMutation, useQueryClient } from "@tanstack/react-query";
import { USER_BLOCKED_QUERY_KEY } from "../../../modals/user-settings/queries/user-blocked-query.ts";
import { useRouter } from "@tanstack/react-router";
import { forumUserClient } from "@repo/shared/api/forum-client.ts";

type BlockedUsers = Array<{ nickname: string }>

type DeleteUserFromBlocked = {
  recipient: string;
};

async function deleteUserFromBlocked({
  recipient,
}: DeleteUserFromBlocked) {
  const res = await forumUserClient.user["control-user-blocked"].$post({
    json: {
      recipient,
      type: "unblock"
    }
  })

  const data = await res.json();

  if (!data || "error" in data) {
    return null
  }

  const { status } = data;

  return { status }
}

export const useDeleteFromBlocked = () => {
  const qc = useQueryClient();
  const { invalidate } = useRouter()

  const deleteUserFromBlockedMutation = useMutation({
    mutationFn: async (recipient: string) => deleteUserFromBlocked({ recipient }),
    onSuccess: async (data, variables) => {
      if (!data) return;

      const blockedUsers = qc.getQueryData<BlockedUsers>(USER_BLOCKED_QUERY_KEY);

      if (!blockedUsers) return;

      const updatedBlockedUsers = blockedUsers.filter(u => u.nickname !== variables);

      if (updatedBlockedUsers.length <= 1) {
        return qc.setQueryData(USER_BLOCKED_QUERY_KEY, null);
      }

      invalidate()

      return qc.setQueryData(USER_BLOCKED_QUERY_KEY, updatedBlockedUsers);
    },
    onError: e => { throw new Error(e.message) },
  });

  return { deleteUserFromBlockedMutation };
};