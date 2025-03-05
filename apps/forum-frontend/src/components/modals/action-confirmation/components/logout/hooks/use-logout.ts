import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { authClient } from "@repo/shared/api/auth-client";
import { GLOBAL_OPTION_QUERY_KEY, GlobalOptionQuery } from "@repo/lib/queries/global-option-query";

export const LOGOUT_MUTATION_KEY = ["logout"];

async function deleteSession() {
  const res = await authClient["invalidate-session"].$post();

  const data = await res.json();

  if ("error" in data) {
    throw new Error(data.error);
  }

  return data;
}

export const useLogout = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationKey: LOGOUT_MUTATION_KEY,
    mutationFn: () => deleteSession(),
    onSuccess: async (data) => {
      if (!data.status) {
        return toast.error("Произошла ошибка");
      }

      toast.info("Вы вышли из аккаунта")

      qc.setQueryData(GLOBAL_OPTION_QUERY_KEY,
        (prev: GlobalOptionQuery) => ({ ...prev, isAuthenticated: false })
      )

      await navigate({ to: "/auth" });
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  return { logoutMutation };
};