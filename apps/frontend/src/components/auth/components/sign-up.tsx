import { Input } from "@repo/ui/src/components/input.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { acceptRulesAtom, authAction, findoutAtom, authIsValidAtom } from "../models/auth.model.ts";
import { reatomComponent } from "@reatom/npm-react";
import { CloudflareTurnstile } from "./cloudflare-turnstile.tsx";
import { AuthStatus } from "./status.tsx";
import { ArrowRight, Info } from "lucide-react";
import { FormField, NicknameInput, PasswordInput } from "./fields.tsx";
import { WindowLoader } from "@repo/ui/src/components/window-loader.tsx";

const Checkbox = reatomComponent(({ ctx }) => {
  return (
    <>
      <input
        id="rules"
        type="checkbox"
        className="peer h-5 w-5 lg:h-6 lg:w-6 cursor-pointer transition-all appearance-none
          rounded-lg shadow hover:shadow-md border-[2px] border-shark-600 bg-shark-700 checked:bg-shark-900 checked:border-black"
        onChange={e => acceptRulesAtom(ctx, e.target.checked)}
      />
      <span
        className="absolute text-white opacity-0 peer-checked:opacity-100
               top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5"
          viewBox="0 0 20 20"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          ></path>
        </svg>
      </span>
    </>
  )
}, "CheckboxIcon")

const FindoutInput = reatomComponent(({ ctx }) => {
  return (
    <FormField>
      <Info size={20} className="font-bold text-shark-300" />
      <Input
        id="findout"
        type="text"
        onChange={e => findoutAtom(ctx, e.target.value)}
        placeholder="откуда узнали о проекте"
        autoComplete="new-password"
        backgroundType="transparent"
        className="placeholder:font-semibold !px-3 !text-base placeholder:text-base"
      />
    </FormField>
  )
}, "FindoutInput")

export const SignUpForm = reatomComponent(({ ctx }) => {
  const isPending = ctx.spy(authAction.statusesAtom).isPending
  const isDisabled = !ctx.spy(authIsValidAtom) || isPending

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    authAction(ctx)
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col p-2 gap-y-4 w-full">
      <NicknameInput />
      <PasswordInput />
      <FindoutInput />
      <div className="inline-flex gap-2 items-center">
        <label htmlFor="rules" className="flex items-center cursor-pointer relative">
          <Checkbox />
        </label>
        <label className="select-none cursor-pointer" htmlFor="rules">
          <Typography className="text-[15px] break-words lg:text-[18px] text-shark-100">
            Согласен с&nbsp;
            <a
              href="/rules"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              правилами
            </a>
            &nbsp;проекта
          </Typography>
        </label>
      </div>
      <CloudflareTurnstile />
      <div className="flex flex-col sm:flex-row justify-between mt-4 items-center w-full gap-2">
        <AuthStatus />
        <Button
          className="hover:bg-green-500 gap-4 items-center bg-green-600"
          disabled={isDisabled}
        >
          <Typography textSize="medium" textColor="shark_white" className="text-lg">
            Создать аккаунт
          </Typography>
          {isPending ? <WindowLoader size="small" /> : <ArrowRight size={20} />}
        </Button>
      </div>
    </form>
  );
}, "SignUpForm")