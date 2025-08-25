import { Button } from "@repo/ui/src/components/button.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { authAction, authIsValidAtom } from "../models/auth.model.ts";
import { reatomComponent } from "@reatom/npm-react";
import { CloudflareTurnstile } from "./cloudflare-turnstile.tsx";
import { AuthStatus } from "./status.tsx";
import { ArrowRight } from "lucide-react";
import { NicknameInput, PasswordInput } from "./fields.tsx";
import { WindowLoader } from "@repo/ui/src/components/window-loader.tsx";

export const SignInForm = reatomComponent(({ ctx }) => {
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
      <CloudflareTurnstile />
      <div className="flex flex-col sm:flex-row justify-between mt-4 items-center w-full gap-2">
        <AuthStatus />
        <Button className="hover:bg-green-500 gap-4 items-center bg-green-600" disabled={isDisabled}>
          <Typography textSize="medium" textColor="shark_white" className="text-lg">
            Войти в аккаунт
          </Typography>
          {isPending ? <WindowLoader size="small" /> : <ArrowRight size={20} />}
        </Button>
      </div>
    </form>
  );
}, "SignInForm")