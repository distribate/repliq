import { action, atom } from "@reatom/core";
import { withReset } from "@reatom/framework";
import { AUTH_REDIRECT, USER_URL } from "@repo/shared/constants/routes.ts";
import { toast } from "sonner";
import { globalOptionsAtom } from "@repo/lib/queries/global-option-query";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { router } from "#main.tsx";
import { authClient } from "@repo/shared/api/auth-client";
import { UAParser } from 'ua-parser-js';
import { z } from "zod";
import { registerSchema } from '@repo/types/schemas/auth/create-session-schema.ts';
import consola from "consola";

type AuthGlobalOptions = {
  passwordVisibility: "password" | "text";
  detailsVisibility: "hidden" | "visible";
}

export type AuthValues = {
  status?: string;
  token: string;
  nickname: string;
  password: string;
  findout: string;
  acceptRules: boolean;
  realName: string;
  referrer?: string;
};

export const authValuesAtom = atom<AuthValues | null>(null, "authValues").pipe(withReset())
export const authTypeAtom = atom<"register" | "login">("register", "authType")
export const authGlobalOptionsAtom = atom<AuthGlobalOptions>({ passwordVisibility: "password", detailsVisibility: "visible" }, "authGlobalOptions")

authValuesAtom.onChange((ctx, v) => consola.info(`authValuesAtom`, v))
authTypeAtom.onChange((ctx, v) => consola.info(`authTypeAtom`, v))

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

type LoginToForum = {
  nickname: string;
  password: string;
  token: string;
}

async function registerForum({
  nickname, password, findout, referrer, token
}: z.infer<typeof registerSchema>) {
  const res = await authClient.register.$post({
    json: { nickname, password, findout, referrer, token },
  });

  const data = await res.json();

  if (!data) return null;

  return data
}

async function loginForum({
  nickname, password, token
}: LoginToForum) {
  const userAgent = navigator.userAgent;
  const { browser, cpu, device, os } = UAParser(userAgent);

  const info = {
    browser: browser.name ?? "Unknown",
    ua: userAgent,
    ip: null,
    cpu: cpu.architecture ?? "Unknown",
    os: os.name ?? "Unknown",
    device: device ? JSON.stringify(device) : "Unknown",
    isBot: false,
  }

  const res = await authClient.login.$post({
    json: { nickname, password, ...info, token }
  });

  const data = await res.json();

  if (!data) return null;

  return data;
}

export const authAction = reatomAsync(async (ctx) => {
  const authValues = ctx.get(authValuesAtom)
  const authType = ctx.get(authTypeAtom)

  consola.info(`authAction.authValues`, authValues)

  if (!authValues) return;

  const { findout, password, nickname, referrer, token } = authValues;

  switch (authType) {
    case "login":
      return await loginForum({ nickname, password, token });
    case "register":
      return await registerForum({ nickname, password, findout, referrer, token });
  }
}, {
  name: "authAction",
  onFulfill: (ctx, res) => {
    const authValues = ctx.get(authValuesAtom)
    const authType = ctx.get(authTypeAtom)

    if (!authValues || !res) return;

    const { nickname } = authValues

    if (authType === 'login') {
      if ("error" in res) {
        authValuesAtom(ctx, (state) => state ? ({
          ...state,
          status: LOGIN_MESSAGES[res.error] ?? "Что-то пошло не так"
        }) : null)

        return;
      }

      authValuesAtom(ctx, (state) => state ? ({
        ...state,
        status: LOGIN_MESSAGES[res.status] ?? "Что-то пошло не так",
      }) : null)

      ctx.schedule(() => router.navigate({ to: USER_URL + nickname }))

      authValuesAtom.reset(ctx)
    }

    if (authType === 'register') {
      if ("error" in res) {
        authValuesAtom(ctx, (state) => state ? ({
          ...state,
          status: REGISTER_MESSAGES[res.error] ?? "Что-то пошло не так",
        }) : null)

        return;
      }

      globalOptionsAtom(ctx, (state) => ({ ...state, isStarted: true }))

      authValuesAtom(ctx, (state) => state ? ({ ...state, status: REGISTER_MESSAGES[res.status] }) : null)

      toast.success("Спасибо за регистрацию!", {
        description: "Теперь вы можете войти в аккаунт.",
      });

      authTypeAtom(ctx, "login")

      authValuesAtom.reset(ctx)
    }
  }
}).pipe(withStatusesAtom())

export const changeAuthTypeAction = action(async (ctx) => {
  authValuesAtom.reset(ctx)
  ctx.schedule(() => router.navigate({ to: AUTH_REDIRECT }))
})