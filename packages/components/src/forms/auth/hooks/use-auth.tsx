import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AUTH_QUERY_KEY, AuthQuery } from "../queries/auth-query.ts";
import { AUTH_REDIRECT, USER_URL } from "@repo/shared/constants/routes.ts";
import { useNavigate } from "@tanstack/react-router";
import { registerForum } from '#forms/auth/queries/register-forum.ts';
import { loginForum } from "../queries/login-forum.ts";
import { toast } from "sonner";
import { GLOBAL_OPTION_QUERY_KEY, GlobalOptionQuery } from "@repo/lib/queries/global-option-query";

export const AUTH_MUTATION_KEY = ["auth-mutation"];

const LOGIN_MESSAGES: Record<string, string> = {
  "Invalid password": "Неверный пароль",
  "Not found": "Пользователь не найден",
  "Success": "Входим в аккаунт..."
}

const REGISTER_MESSAGES: Record<string, string> = {
  "IP already exists": "Превышен лимит регистраций",
  "Nickname invalid": "Неверное имя пользователя.",
  "Unsafe password": "Ненадежный пароль",
  "User already exists": "Такой пользователь уже зарегистрирован",
  "Success": "Пользователь зарегистрирован",
  "Not found": "Пользователь не найден",
  "Error in creating user": "Ошибка при регистрации"
}

export const useAuth = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();

  const setAuthValuesMutation = useMutation({
    mutationKey: AUTH_MUTATION_KEY,
    mutationFn: async () => {
      const authValues = qc.getQueryData<AuthQuery>(AUTH_QUERY_KEY);
      if (!authValues || !authValues.values) return;

      const { values, type } = authValues;
      const { findout, password, nickname, realName, referrer } = values;

      if (type === "sign-in") {
        const login = await loginForum({ nickname, password });

        if (!login) return;

        if ("error" in login) {
          return qc.setQueryData(AUTH_QUERY_KEY, (prev: AuthQuery) => ({
            ...prev,
            status: LOGIN_MESSAGES[login.error] ?? "Что-то пошло не так",
          }))
        }

        qc.setQueryData(AUTH_QUERY_KEY, (prev: AuthQuery) => ({
          ...prev,
          status: LOGIN_MESSAGES[login.status] ?? "Что-то пошло не так",
        }))

        navigate({ to: USER_URL + nickname });

        return qc.resetQueries({ queryKey: AUTH_QUERY_KEY });
      }

      if (type === "sign-up") {
        const register = await registerForum({
          nickname, password, details: { findout, realName, referrer },
        });

        if (!register) return;

        if ("error" in register) {
          return qc.setQueryData(AUTH_QUERY_KEY, (prev: AuthQuery) => ({
            ...prev,
            status: REGISTER_MESSAGES[register.error] ?? "Что-то пошло не так",
          }));
        }

        qc.setQueryData(GLOBAL_OPTION_QUERY_KEY, (prev: GlobalOptionQuery) => ({
          ...prev,
          isStarted: true
        }))

        qc.setQueryData(AUTH_QUERY_KEY, (prev: AuthQuery) => ({
          ...prev,
          status: REGISTER_MESSAGES[register.status],
        }));

        toast.success("Спасибо за регистрацию!", {
          description: "Теперь вы можете войти в аккаунт.",
        });

        navigate({ to: AUTH_REDIRECT });

        return qc.resetQueries({ queryKey: AUTH_QUERY_KEY });
      }
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  return { setAuthValuesMutation };
};