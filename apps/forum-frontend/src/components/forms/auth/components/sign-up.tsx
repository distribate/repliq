import { Input } from "@repo/ui/src/components/input.tsx";
import { FieldError, useForm, UseFormRegister } from "react-hook-form";
import { Button } from "@repo/ui/src/components/button.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { authAction, authPasswordVisibilityAtom, authStatusAtom, authValuesAtom, registrationSchema } from "../models/auth.model.ts";
import { z } from "zod";
import { PasswordVisibilityBadge } from "./password-visibility-badge.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { FormField, SyncStatusUpdates } from "./sign-in.tsx";
import { CloudflareTurnstile } from "./cloudflare-turnstile.tsx";
import { AuthStatus } from "./status.tsx";
import { ArrowRight, Info, Lock, User } from "lucide-react";

const CheckboxIcon = () => {
  return (
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
  )
}

const PasswordInput = reatomComponent<{
  error: FieldError | undefined,
  register: UseFormRegister<{ password: string; nickname: string } & { acceptRules: boolean; findout: string }>
}>(({ ctx, error, register }) => {
  return (
    <Input
      id="password"
      type={ctx.spy(authPasswordVisibilityAtom)}
      autoComplete="new-password"
      autoCorrect="off"
      className="placeholder:font-semibold !px-3 !text-base placeholder:text-base"
      backgroundType="transparent"
      placeholder="пароль"
      status={error ? "error" : "default"}
      {...register("password")}
    />
  )
})

export const SignUpForm = reatomComponent(({ ctx }) => {
  const {
    register, resetField, formState: { errors, isValid }, handleSubmit, getValues
  } = useForm<z.infer<typeof registrationSchema>>({
    mode: "onChange",
    resolver: zodResolver(registrationSchema),
    defaultValues: { password: "", nickname: "", findout: "", acceptRules: false },
  });

  const onSubmit = () => {
    const values = getValues();
    authValuesAtom(ctx, values)
    authAction(ctx)
  };

  const isDisabled = !isValid || ctx.spy(authAction.statusesAtom).isPending

  return (
    <>
      {/* @ts-expect-error */}
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
            <PasswordInput register={register} error={errors.password} />
          </div>
          <PasswordVisibilityBadge />
        </FormField>
        <FormField>
          <Info size={20} className="font-bold text-shark-300" />
          <Input
            id="findout"
            type="text"
            placeholder="откуда узнали о проекте"
            autoComplete="new-password"
            backgroundType="transparent"
            className="placeholder:font-semibold !px-3 !text-base placeholder:text-base"
            status={errors.findout ? "error" : "default"}
            {...register("findout")}
          />
        </FormField>
        <div className="inline-flex gap-2 items-center">
          <label htmlFor="rules" className="flex items-center cursor-pointer relative">
            <input
              id="rules"
              type="checkbox"
              className="peer h-5 w-5 lg:h-6 lg:w-6 cursor-pointer transition-all appearance-none
                  rounded-lg shadow hover:shadow-md border-[2px] border-shark-600 bg-shark-700 checked:bg-shark-900 checked:border-black"
              {...register("acceptRules")}
            />
            <CheckboxIcon />
          </label>
          <label className="select-none cursor-pointer" htmlFor="rules">
            <Typography className="text-[15px] break-words lg:text-[18px] text-shark-100">
              Согласен с&nbsp;
              <a
                href="https://fasberry.su/rules"
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
        <div className="flex flex-col sm:flex-row items-center justify-end w-full gap-2">
          <AuthStatus />
          <Button className="hover:bg-green-500 gap-4 items-center bg-green-600" disabled={isDisabled}>
            <Typography textSize="medium" textColor="shark_white" className="text-lg">
              Создать аккаунт
            </Typography>
            <ArrowRight size={20} />
          </Button>
        </div>
      </form>
    </>
  );
}, "SignUpForm")