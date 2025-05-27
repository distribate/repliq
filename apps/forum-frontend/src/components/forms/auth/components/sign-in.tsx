import { Input } from "@repo/ui/src/components/input.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { FieldError, useForm, UseFormRegister, UseFormResetField } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@repo/ui/src/components/form-field.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { authorizationSchema } from "../schemas/authorization-schema.ts";
import { authAction, authPasswordVisibilityAtom, authStatusAtom, authValuesAtom } from "../models/auth.model.ts";
import { z } from "zod";
import { PasswordVisibilityBadge } from "./password-visibility-badge.tsx";
import { reatomComponent, useUpdate } from "@reatom/npm-react";
import { CloudflareTurnstile } from "./cloudflare-turnstile.tsx";
import { AuthStatus } from "./status.tsx";

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
  register: UseFormRegister<{
    password: string;
    nickname: string;
  }>
}>(({ ctx, error, register }) => {
  return (
    <Input
      id="password"
      type={ctx.spy(authPasswordVisibilityAtom)}
      className="!bg-shark-900"
      placeholder="игровой пароль"
      autoComplete="new-password"
      autoCorrect="off"
      status={error ? "error" : "default"}
      variant="minecraft"
      {...register("password")}
    />
  )
})

export const SignInForm = reatomComponent(({ ctx }) => {
  const {
    register, handleSubmit, resetField, formState: { errors, isValid, isDirty }, getValues
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
        <FormField label={{ name: "Никнейм", for: "nickname" }} errorMessage={errors?.nickname?.message}>
          <Input
            id="nickname"
            type="text"
            placeholder="игровой ник"
            autoComplete="new-password"
            autoCorrect="off"
            className="!bg-shark-900"
            status={errors.nickname ? "error" : "default"}
            variant="minecraft"
            {...register("nickname")}
          />
        </FormField>
        <FormField label={{ name: "Пароль", for: "password" }} errorMessage={errors?.password?.message}>
          <div className="flex items-center gap-2 justify-center">
            <PasswordInput error={errors.password} register={register} />
            <PasswordVisibilityBadge />
          </div>
        </FormField>
        <CloudflareTurnstile isDirty={isDirty} />
        <div className="flex flex-col sm:flex-row items-center justify-end w-full gap-2">
          <AuthStatus/>
          <Button
            variant="minecraft" rounded="none" className="hover:bg-green-500 bg-green-600" disabled={isDisabled}
          >
            <Typography font="minecraft" textSize="medium" textColor="shark_white" className="text-lg">
              Войти в аккаунт
            </Typography>
          </Button>
        </div>
      </form>
    </>
  );
}, "SignInForm")