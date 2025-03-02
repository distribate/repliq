import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router"
import { BLOCKED_QUERY_KEY } from "../queries/blocked-user-query";

export const UNBLOCK_USER_MUTATION_KEY = ["unblock-user"];
export const BLOCK_USER_MUTATION_KEY = ["block-user"];

export const useBlockUser = () => {
  const qc = useQueryClient();
  const { invalidate } = useRouter();

  const blockUserMutation = useMutation({
    mutationKey: BLOCK_USER_MUTATION_KEY,
    mutationFn: async (requestedNickname: string) => null,
    onSuccess: async (data, variables) => {
      // if (!data)
      //   return toast.error("Произошла ошибка", {
      //     description: "Попробуйте попытку позже!",
      //   });

      // toast.success("Пользователь заблокирован");
      // invalidate();

      // return qc.invalidateQueries({
      //   queryKey: BLOCKED_QUERY_KEY(variables),
      // });
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  const unblockUserMutation = useMutation({
    mutationKey: UNBLOCK_USER_MUTATION_KEY,
    mutationFn: async (requestedNickname: string) => null,
    onSuccess: async (data, variables) => {
      // if (!data)
      //   return toast.error("Произошла ошибка", {
      //     description: "Попробуйте попытку позже!",
      //   });

      // toast.success("Пользователь разблокирован");
      // invalidate();

      // return qc.invalidateQueries({
      //   queryKey: BLOCKED_QUERY_KEY(variables),
      // });
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  return { blockUserMutation, unblockUserMutation };
};
