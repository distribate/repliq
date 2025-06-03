import { action, atom } from "@reatom/core";
import { sleep, withReset } from "@reatom/framework";
import { AUTH_REDIRECT, USER_URL } from "@repo/shared/constants/routes.ts";
import { toast } from "sonner";
import { isStartedAtom } from "@repo/lib/queries/global-option-query";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { router } from "#main.tsx";
import { authClient } from "@repo/shared/api/auth-client";
import { UAParser } from 'ua-parser-js';
import { registerSchema } from '@repo/types/schemas/auth/create-session-schema.ts';
import { isProduction } from "@repo/lib/helpers/is-production";
import { nicknameSchema, passwordSchema } from "@repo/types/schemas/auth/create-session-schema";
import { z } from "zod";

export const authorizationSchema = z.object({
  nickname: nicknameSchema,
  password: passwordSchema,
});

export const registrationSchema = authorizationSchema.and(z.object({
  acceptRules: z.literal<boolean>(true, {
    errorMap: () => ({ message: "Вы должны согласиться с правилами, прежде чем авторизовываться", }),
  }),
  findout: z.string()
    .min(2, { message: "Опишите причину подробнее, пожалуйста", })
    .max(128),
}));

export type PasswordVisiblity = "password" | "text"
type DetailsVisibility = "hidden" | "visible"
type AuthType = "register" | "login"
type StatusType = "positive" | "negative"

type AuthValues = {
  nickname: string;
  password: string;
  findout: string;
  acceptRules: boolean;
};

export type SignInValues = Omit<AuthValues, "acceptRules" | "findout">
export type SignUpValues = AuthValues

const LOGIN_MESSAGES = {
  "Invalid password": "Неверный пароль",
  "Not found": "Пользователь не найден",
  "Success": "Входим в аккаунт..."
} as const;

const REGISTER_MESSAGES = {
  "IP already exists": "Превышен лимит регистраций",
  "Nickname invalid": "Неверное имя пользователя.",
  "Unsafe password": "Ненадежный пароль",
  "User already exists": "Такой пользователь уже зарегистрирован",
  "Success": "Пользователь зарегистрирован",
  "Not found": "Пользователь не найден",
  "Error in creating user": "Ошибка при регистрации"
} as const;

type StatusKeys = keyof typeof REGISTER_MESSAGES | keyof typeof LOGIN_MESSAGES

const STATUS_TYPES: Record<StatusKeys, StatusType> = {
  "User already exists": "negative",
  "Invalid password": "negative",
  "Success": "positive",
  "Not found": "negative",
  "Error in creating user": "negative",
  "Unsafe password": "negative",
  "Nickname invalid": "negative",
  "IP already exists": "negative"
}

export const authValuesAtom = atom<SignUpValues | SignInValues | null>(null, "authValues").pipe(withReset())
export const authStatusTypeAtom = atom<StatusType>("positive", "authStatusType").pipe(withReset())
export const authStatusAtom = atom<string | null>(null, "authStatus").pipe(withReset())
export const authStatusMessageAtom = atom<string | null>(null, "authStatusMessage").pipe(withReset())
export const authTokenAtom = atom<string | undefined>(undefined, "authToken").pipe(withReset())
export const authReferrerAtom = atom<string | undefined>(undefined, "authReferrer")
export const authTypeAtom = atom<AuthType>("login", "authType")
export const authDetailsVisibilityAtom = atom<DetailsVisibility>("visible", "authDetailsVisibility")
export const authPasswordVisibilityAtom = atom<PasswordVisiblity>("password", "authPasswordVisibility")
export const turnstileIsOpenAtom = atom(false, "turnstileIsOpen")

authTypeAtom.onChange((ctx) => {
  authValuesAtom.reset(ctx)
  authTokenAtom.reset(ctx)
  authStatusMessageAtom.reset(ctx)
  authStatusAtom.reset(ctx)
  authStatusTypeAtom.reset(ctx)
})

authStatusAtom.onChange((ctx, state) => {
  if (!state) return;

  authStatusTypeAtom(ctx, STATUS_TYPES[state as StatusKeys])

  const type = ctx.get(authTypeAtom)

  if (type === 'login') {
    authStatusMessageAtom(ctx, LOGIN_MESSAGES[state as keyof typeof LOGIN_MESSAGES])
  }

  if (type === 'register') {
    authStatusMessageAtom(ctx, REGISTER_MESSAGES[state as keyof typeof REGISTER_MESSAGES])
  }
})

export const changeAuthTypeAction = action(async (ctx) => {
  ctx.schedule(() => router.navigate({ to: AUTH_REDIRECT }))
})

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
}: Omit<z.infer<typeof registerSchema>, "findout" | "referrer">) {
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
  const turnstileIsOpen = ctx.get(turnstileIsOpenAtom)

  if (!authValues) return;

  if (isProduction && !turnstileIsOpen) {
    toast.info("Проверка", { description: "Пройдите проверку, чтобы продолжить" })
    turnstileIsOpenAtom(ctx, true)
    return;
  }

  const token = ctx.get(authTokenAtom)
  if (!token && isProduction) return

  const { password, nickname } = authValues;

  switch (authType) {
    case "login":
      return await loginForum({ nickname, password, token });
    case "register":
      const findout = "findout" in authValues ? authValues.findout : null
      if (!findout) return;

      const referrer = ctx.get(authReferrerAtom)

      return await registerForum({ nickname, password, findout, referrer, token });
  }
}, {
  name: "authAction",
  onFulfill: async (ctx, res) => {
    if (!res) return;

    const authValues = ctx.get(authValuesAtom)
    if (!authValues) return;

    const authType = ctx.get(authTypeAtom)

    if (authType === 'login') {
      if ("error" in res) {
        authStatusAtom(ctx, res.error)
        await sleep(1000)
        return;
      }

      authStatusAtom(ctx, res.status)
      authValuesAtom.reset(ctx)
      turnstileIsOpenAtom(ctx, false)

      await ctx.schedule(() => sleep(500))

      ctx.schedule(() => router.navigate({ to: USER_URL + authValues.nickname }))
    }

    if (authType === 'register') {
      if ("error" in res) {
        authStatusAtom(ctx, res.error)
        await sleep(1000)

        return;
      }

      isStartedAtom(ctx, true)
      authStatusAtom(ctx, res.status)
      authTypeAtom(ctx, "login")
      authValuesAtom.reset(ctx)
      turnstileIsOpenAtom(ctx, false)

      toast.success("Спасибо за регистрацию!", {
        description: "Теперь вы можете войти в аккаунт.",
      });
    }
  }
}).pipe(withStatusesAtom())