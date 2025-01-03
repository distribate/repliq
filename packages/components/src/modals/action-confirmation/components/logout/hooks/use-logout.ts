import { deleteSession } from "@repo/lib/actions/delete-session.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AUTH_REDIRECT } from "@repo/shared/constants/routes.ts";
import { toast } from "sonner";
import { delay } from "@repo/lib/helpers/delay.ts";

export const LOGOUT_MUTATION_KEY = ["logout"];

export const useLogout = () => {
  const qc = useQueryClient();
  const { push } = useRouter();

  const logoutMutation = useMutation({
    mutationKey: LOGOUT_MUTATION_KEY,
    mutationFn: async () => deleteSession(),
    onSuccess: async () => {
      push(AUTH_REDIRECT)
      await delay(2000, qc.clear());
    },
    onSettled: () => toast.info("Вы вышли из аккаунта"),
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  return { logoutMutation };
};
