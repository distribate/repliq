import { action, atom, Ctx } from "@reatom/core";
import { withComputed, withInit, withReset } from "@reatom/framework";
import { toast } from "sonner";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { authClient } from "#shared/auth-client";
import { findoutSchema, registerSchema, nicknameSchema, passwordSchema } from '@repo/types/schemas/auth/create-session-schema.ts';
import { isProduction } from "@repo/lib/helpers/is-production";
import * as z from "zod";
import { createIdLink } from "@repo/lib/utils/create-link";
import {
  LOGIN_MESSAGES,
  NOT_ACCEPT_RULES_MESSAGE,
  NOT_TOKEN_MESSAGES,
  REGISTER_MESSAGES,
  STATUS_TYPES,
  SUCCESS_REGISTER_MESSAGES
} from "./messages";
import { logger } from "@repo/lib/utils/logger";
import { withSsr } from "#lib/ssr";

type AuthValues = {
  nickname: string;
  password: string;
  findout: string;
  acceptRules: boolean;
  token: string | null
};

type SignInValues = Omit<AuthValues, "acceptRules" | "findout">
type SignUpValues = AuthValues

export const IS_AUTHENTICATED_ATOM_KEY = "isAuthenticatedAtom"

export const isAuthenticatedAtom = atom(false, "isAuthenticated").pipe(
  withSsr(IS_AUTHENTICATED_ATOM_KEY)
)

export const nicknameAtom = atom<string>("", "authNickname").pipe(withReset())
export const passwordAtom = atom<string>("", "authPassword").pipe(withReset())
export const findoutAtom = atom<string>("", "authFindout").pipe(withReset())
export const tokenAtom = atom<string | null>(null, "authToken").pipe(withReset())
export const referrerAtom = atom<string | null>(null, "authReferrer")
export const acceptRulesAtom = atom(false, "authAcceptRules").pipe(withReset())

export const statusTypeAtom = atom<"positive" | "negative">("positive", "authStatusType").pipe(withReset())
export const statusAtom = atom<string | null>(null, "authStatus").pipe(withReset())
export const statusMessageAtom = atom<string | null>(null, "authStatusMessage").pipe(withReset())

export const authTypeAtom = atom<"register" | "login">("login", "authType")

export const detailsVisibilityAtom = atom<"hidden" | "visible">("visible", "authDetailsVisibility")
export const passwordVisibilityAtom = atom<"password" | "text">("password", "authPasswordVisibility")

export const turnstileIsOpenAtom = atom(false, "turnstileIsOpen").pipe(
  withInit((_) => isProduction ? false : true)
)

const loginIsValidAtom = atom(false, "authLoginIsValid").pipe(withReset())
const passwordIsValidAtom = atom(false, "authPasswordIsValid").pipe(withReset())
const tokenIsValidAtom = atom(true, "authTokenIsValid").pipe(withReset())
const findoutIsValidAtom = atom(false, "authFindoutIsValid").pipe(withReset())

export const nicknameErrorAtom = atom<"error" | "default">("default", "nicknameIsError").pipe(withReset())
export const passwordErrorAtom = atom<"error" | "default">("default", "passwordIsError").pipe(withReset())
export const findoutErrorAtom = atom<"error" | "default">("default", "findoutIsError").pipe(withReset())

export const authIsValidAtom = atom(false, "authIsValid").pipe(
  withReset(),
  withComputed((ctx) => {
    const login = ctx.spy(loginIsValidAtom)
    const password = ctx.spy(passwordIsValidAtom)
    const token = ctx.spy(tokenIsValidAtom)
    const findout = ctx.get(authTypeAtom) === 'register' ? ctx.spy(findoutIsValidAtom) : true

    return login && password && token && findout;
  }),
)

nicknameAtom.onChange((ctx, state) => loginIsValidAtom(ctx, nicknameSchema.safeParse(state).success))
passwordAtom.onChange((ctx, state) => passwordIsValidAtom(ctx, passwordSchema.safeParse(state).success))
findoutAtom.onChange((ctx, state) => findoutIsValidAtom(ctx, findoutSchema.safeParse(state).success))

turnstileIsOpenAtom.onChange((ctx, state) => {
  if (!state) return;

  const token = ctx.get(tokenAtom)

  if (!token) tokenIsValidAtom(ctx, false)
})

tokenAtom.onChange((ctx) => {
  const isValid = ctx.get(tokenIsValidAtom)

  if (!isValid) tokenIsValidAtom(ctx, true)
})

authTypeAtom.onChange((ctx) => resetAuth(ctx))

statusAtom.onChange((ctx, state) => {
  if (!state) return;

  const target = state as keyof typeof LOGIN_MESSAGES | keyof typeof REGISTER_MESSAGES

  statusTypeAtom(ctx, STATUS_TYPES[target])

  const type = ctx.get(authTypeAtom)

  if (target === 'Invalid password' || target === 'Unsafe password') {
    passwordErrorAtom(ctx, "error")
  }

  if (type === 'login') {
    statusMessageAtom(ctx, LOGIN_MESSAGES[state as keyof typeof LOGIN_MESSAGES])
  }

  if (type === 'register') {
    statusMessageAtom(ctx, REGISTER_MESSAGES[state as keyof typeof REGISTER_MESSAGES])
  }
})

async function registerForum({ signal, ...json }: z.infer<typeof registerSchema> & { signal?: AbortSignal }) {
  const res = await authClient.register.$post({ json }, { init: { signal } });
  return await res.json()
}

async function loginForum({ signal, ...json }: Omit<z.infer<typeof registerSchema>, "findout" | "referrer"> & { signal?: AbortSignal }) {
  const res = await authClient.login.$post({ json }, { init: { signal } });
  return await res.json();
}

export const authAction = reatomAsync(async (ctx) => {
  const type = ctx.get(authTypeAtom)
  const turnstileIsOpen = ctx.get(turnstileIsOpenAtom)

  if (isProduction && !turnstileIsOpen) {
    toast.info(NOT_TOKEN_MESSAGES.title, { description: NOT_TOKEN_MESSAGES.description })

    turnstileIsOpenAtom(ctx, true)
    return;
  }

  const token = ctx.get(tokenAtom)
  if (isProduction && !token) return

  if (type === 'login') {
    const values: SignInValues = {
      password: ctx.get(passwordAtom),
      nickname: ctx.get(nicknameAtom),
      token
    }

    return await ctx.schedule(() => loginForum({ signal: ctx.controller.signal, ...values }));
  }

  if (type === 'register') {
    if (!ctx.get(acceptRulesAtom)) {
      toast.error(NOT_ACCEPT_RULES_MESSAGE)
      return;
    }

    const values: SignUpValues = {
      nickname: ctx.get(nicknameAtom),
      password: ctx.get(passwordAtom),
      findout: ctx.get(findoutAtom),
      acceptRules: ctx.get(acceptRulesAtom),
      token
    }

    const referrer = ctx.get(referrerAtom)

    return await ctx.schedule(() => registerForum({ signal: ctx.controller.signal, ...values, referrer }));
  }
}, {
  name: "authAction",
  onFulfill: async (ctx, res) => {
    if (!res) return;

    const type = ctx.get(authTypeAtom)

    if ("error" in res) {
      statusAtom(ctx, res.error)
      return;
    }

    statusAtom(ctx, res.status)
    turnstileIsOpenAtom(ctx, false)

    if (type === 'login') {
      const nickname = ctx.get(nicknameAtom)

      ctx.schedule(() => window.location.replace(createIdLink("user", nickname)))
    }

    if (type === 'register') {
      authTypeAtom(ctx, "login")

      toast.success(SUCCESS_REGISTER_MESSAGES.title, { description: SUCCESS_REGISTER_MESSAGES.description });
    }

    resetAuth(ctx)
  }
}).pipe(withStatusesAtom())

export const changeAuthTypeAction = action(async (ctx) => {
  ctx.schedule(() => window.location.replace(createIdLink("auth")))
})

export function resetAuth(ctx: Ctx) {
  logger.info("resetAuth")

  nicknameAtom.reset(ctx)
  passwordAtom.reset(ctx)
  findoutAtom.reset(ctx)
  acceptRulesAtom.reset(ctx)
  tokenAtom.reset(ctx)

  resetStatus(ctx)

  authIsValidAtom.reset(ctx)
  loginIsValidAtom.reset(ctx)
  passwordIsValidAtom.reset(ctx)
  tokenIsValidAtom.reset(ctx)
  findoutIsValidAtom.reset(ctx)

  nicknameErrorAtom.reset(ctx)
  passwordErrorAtom.reset(ctx)
  findoutErrorAtom.reset(ctx)
}

export function resetStatus(ctx: Ctx) {
  statusMessageAtom.reset(ctx)
  statusAtom.reset(ctx)
  statusTypeAtom.reset(ctx)
}

export const inputOnClickAction = action((ctx, name: "nickname" | "password") => {
  resetStatus(ctx)
  if (name === 'nickname') {
    nicknameErrorAtom.reset(ctx)
  }
  if (name === 'password') {
    passwordErrorAtom.reset(ctx)
  }
})