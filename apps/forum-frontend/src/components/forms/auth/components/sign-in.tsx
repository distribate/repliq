import { Input } from "@repo/ui/src/components/input.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { FieldError, useForm, UseFormRegister, UseFormResetField } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { authAction, authorizationSchema, authPasswordVisibilityAtom, authStatusAtom, authValuesAtom } from "../models/auth.model.ts";
import { z } from "zod";
import { PasswordVisibilityBadge } from "./password-visibility-badge.tsx";
import { reatomComponent, useUpdate } from "@reatom/npm-react";
import { CloudflareTurnstile } from "./cloudflare-turnstile.tsx";
import { AuthStatus } from "./status.tsx";
import { ArrowRight, Lock, User } from "lucide-react";
import { PropsWithChildren } from "react";
import { cn } from "@repo/lib/utils/ui/cn.ts";

export const SyncStatusUpdates = ({ status, resetField }: {
  status: string | null,
  resetField: UseFormResetField<{
    password: string;
    nickname: string;
  }>
}) => {
  useUpdate(() => {
    if (status === 'Nickname invalid') {
      return resetField("nickname");
    }

    if (status === 'Unsafe password') {
      return resetField("password");
    }
  }, [status])

  return null;
}

const PasswordInput = reatomComponent<{
  error: FieldError | undefined,
  register: UseFormRegister<{ password: string; nickname: string }>
}>(({ ctx, error, register }) => {
  return (
    <Input
      id="password"
      type={ctx.spy(authPasswordVisibilityAtom)}
      backgroundType="transparent"
      placeholder="игровой пароль"
      autoComplete="new-password"
      className="placeholder:font-semibold !px-3 !text-base placeholder:text-base"
      autoCorrect="off"
      status={error ? "error" : "default"}
      {...register("password")}
    />
  )
})

export const FormField = ({ children, className }: PropsWithChildren & { className?: string }) => {
  return (
    <div className={cn(`
      flex items-center justify-start w-full 
      focus-within:outline focus-within:outline-4 
      focus-within:outline-green-600 rounded-xl px-4 py-1 bg-shark-900`, className)}
    >
      {children}
    </div>
  )
}

export const SignInForm = reatomComponent(({ ctx }) => {
  const {
    register, handleSubmit, resetField, formState: { errors, isValid }, getValues
  } = useForm<z.infer<typeof authorizationSchema>>({
    mode: "onChange",
    resolver: zodResolver(authorizationSchema),
    defaultValues: { password: "", nickname: "" }
  });

  const onSubmit = () => {
    const values = getValues()
    authValuesAtom(ctx, values)
    authAction(ctx)
  };

  const isDisabled = !isValid || ctx.spy(authAction.statusesAtom).isPending

  return (
    <>
      <SyncStatusUpdates status={ctx.spy(authStatusAtom)} resetField={resetField} />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-2 gap-y-4 w-full">
        <FormField>
          <User size={20} className="font-bold text-shark-300" />
          <Input
            id="nickname"
            type="text"
            placeholder="логин"
            autoComplete="new-password"
            autoCorrect="off"
            backgroundType="transparent"
            className="placeholder:font-semibold !px-3 !text-base placeholder:text-base"
            status={errors.nickname ? "error" : "default"}
            {...register("nickname")}
          />
        </FormField>
        <FormField className="justify-between">
          <div className="flex items-center w-full">
            <Lock size={20} className="font-bold text-shark-300" />
            <PasswordInput error={errors.password} register={register} />
          </div>
          <PasswordVisibilityBadge />
        </FormField>
        <CloudflareTurnstile />
        <div className="flex flex-col sm:flex-row justify-between mt-4 items-center w-full gap-2">
          <AuthStatus />
          <Button className="hover:bg-green-500 gap-4 items-center bg-green-600" disabled={isDisabled}>
            <Typography textSize="medium" textColor="shark_white" className="text-lg">
              Войти в аккаунт
            </Typography>
            <ArrowRight size={20} />
          </Button>
        </div>
      </form>
    </>
  );
}, "SignInForm")