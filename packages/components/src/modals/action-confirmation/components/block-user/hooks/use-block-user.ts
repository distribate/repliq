import { useMutation, useQueryClient } from "@tanstack/react-query";
import { blockUser } from "#modals/action-confirmation/components/block-user/queries/block-user.ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { unblockUser } from "#modals/action-confirmation/components/block-user/queries/unblock-user.ts";
import { BLOCKED_QUERY_KEY } from "../queries/blocked-user-query";

export const UNBLOCK_USER_MUTATION_KEY = ["unblock-user"];
export const BLOCK_USER_MUTATION_KEY = ["block-user"];

export const useBlockUser = () => {
  const qc = useQueryClient();
  const { refresh } = useRouter();

  const blockUserMutation = useMutation({
    mutationKey: BLOCK_USER_MUTATION_KEY,
    mutationFn: async (requestedNickname: string) =>
      blockUser(requestedNickname),
    onSuccess: async (data, variables) => {
      if (!data)
        return toast.error("Произошла ошибка", {
          description: "Попробуйте попытку позже!",
        });

      toast.success("Пользователь заблокирован");
      refresh();

      return qc.invalidateQueries({
        queryKey: BLOCKED_QUERY_KEY(variables),
      });
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  const unblockUserMutation = useMutation({
    mutationKey: UNBLOCK_USER_MUTATION_KEY,
    mutationFn: async (requestedNickname: string) =>
      unblockUser(requestedNickname),
    onSuccess: async (data, variables) => {
      if (!data)
        return toast.error("Произошла ошибка", {
          description: "Попробуйте попытку позже!",
        });

      toast.success("Пользователь разблокирован");
      refresh();

      return qc.invalidateQueries({
        queryKey: BLOCKED_QUERY_KEY(variables),
      });
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  return { blockUserMutation, unblockUserMutation };
};
