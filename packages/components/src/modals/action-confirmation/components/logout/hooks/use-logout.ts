import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { AUTH_REDIRECT } from "@repo/shared/constants/routes.ts";
import { toast } from "sonner";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder";
import { AUTH_IMAGE_QUERY_KEY } from "#forms/auth/components/auth-image.tsx";
import { FACT_QUERY_KEY } from "#forms/auth/components/fact-section.tsx";
import { authClient } from "@repo/shared/api/auth-client";

export const LOGOUT_MUTATION_KEY = ["logout"];

export const AUTH_FLAG_QUERY_KEY = createQueryKey("user", ["is-authenticated"])

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

      qc.setQueryData(AUTH_FLAG_QUERY_KEY, false)

      await navigate({ to: AUTH_REDIRECT });

      qc.clear();

      await Promise.all([
        qc.prefetchQuery({ queryKey: AUTH_IMAGE_QUERY_KEY }),
        qc.prefetchQuery({ queryKey: FACT_QUERY_KEY })
      ])
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  return { logoutMutation };
};