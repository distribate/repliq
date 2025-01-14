import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AUTH_QUERY_KEY, AuthQuery } from "../queries/auth-query.ts";
import { AUTH_REDIRECT, USER_URL } from "@repo/shared/constants/routes.ts";
import { useRouter } from "next/navigation";
import { registerForum } from '#forms/auth/queries/register-forum.ts';
import { loginForum } from "../queries/login-forum.ts";

export const AUTH_MUTATION_KEY = ["auth-mutation"];

const LOGIN_MESSAGES: Record<string, string> = {
  "Invalid password": "Неверный пароль",
  "User not found": "Пользователь не найден",
  "User not found on the forum": "Пользователь не зарегистрирован на форуме",
  "User not found on the server": "Пользователь не зарегистрирован на сервере",
}

const REGISTER_MESSAGES: Record<string, string> = {
  "Invalid password": "Неверный пароль",
  "User already exists on the forum": "Пользователь уже зарегистрирован на форуме",
  "User not found on the server": "Пользователь не зарегистрирован на сервере",
  "Success": "Пользователь зарегистрирован"
}

export const useAuth = () => {
  const qc = useQueryClient();
  const { push } = useRouter();

  const setAuthValuesMutation = useMutation({
    mutationKey: AUTH_MUTATION_KEY,
    mutationFn: async () => {
      const authValues = qc.getQueryData<AuthQuery>(AUTH_QUERY_KEY);
      if (!authValues || !authValues.values) return;

      const { values, type } = authValues;
      const { findout, password, nickname, realName } = values;

      if (type === "sign-in") {
        const login = await loginForum({ nickname, password });

        if (!login) return;

        if ("error" in login) {
          return qc.setQueryData(AUTH_QUERY_KEY, (prev: AuthQuery) => ({
            ...prev,
            status: LOGIN_MESSAGES[login.error] ?? "Что-то пошло не так",
          }))
        }

        push(USER_URL + nickname);
        return qc.resetQueries({ queryKey: AUTH_QUERY_KEY });
      }

      if (type === "sign-up") {
        const register = await registerForum({
          nickname, password, realName, findout,
        });

        if (!register) return;

        if ("error" in register) {
          return qc.setQueryData(AUTH_QUERY_KEY, (prev: AuthQuery) => ({
            ...prev,
            status: REGISTER_MESSAGES[register.error] ?? "Что-то пошло не так",
          }));
        }

        qc.setQueryData(AUTH_QUERY_KEY, (prev: AuthQuery) => ({
          ...prev,
          status: REGISTER_MESSAGES[register.status],
        }));

        push(AUTH_REDIRECT)
        return qc.resetQueries({ queryKey: AUTH_QUERY_KEY });
      }
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  return { setAuthValuesMutation };
};