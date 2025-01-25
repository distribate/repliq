import { deleteSession } from "@repo/lib/actions/delete-session.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { AUTH_REDIRECT } from "@repo/shared/constants/routes.ts";
import { toast } from "sonner";

export const LOGOUT_MUTATION_KEY = ["logout"];

export const useLogout = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationKey: LOGOUT_MUTATION_KEY,
    mutationFn: () => deleteSession(),
    onSuccess: async (data) => {
      if (data.success) {
        navigate({ to: AUTH_REDIRECT });
        qc.clear();
      }
    },
    onSettled: () => toast.info("Вы вышли из аккаунта"),
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  return { logoutMutation };
};