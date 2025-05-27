import { FormField } from "@repo/ui/src/components/form-field.tsx";
import { Input } from "@repo/ui/src/components/input.tsx";
import { FieldError, useForm, UseFormRegister } from "react-hook-form";
import { Button } from "@repo/ui/src/components/button.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema } from "../schemas/authorization-schema.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { authAction, authPasswordVisibilityAtom, authStatusAtom, authValuesAtom } from "../models/auth.model.ts";
import { z } from "zod";
import { PasswordVisibilityBadge } from "./password-visibility-badge.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { SyncStatusUpdates } from "./sign-in.tsx";
import { CloudflareTurnstile } from "./cloudflare-turnstile.tsx";
import { AuthStatus } from "./status.tsx";

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
  register: UseFormRegister<{
    password: string;
    nickname: string;
  } & {
    acceptRules: boolean;
    findout: string;
  }>
}>(({ ctx, error, register }) => {
  return (
    <Input
      id="password"
      type={ctx.spy(authPasswordVisibilityAtom)}
      autoComplete="new-password"
      autoCorrect="off"
      className="!bg-shark-900"
      placeholder="пароль"
      status={error ? "error" : "default"}
      variant="minecraft"
      {...register("password")}
    />
  )
})

export const SignUpForm = reatomComponent(({ ctx }) => {
  const {
    register, resetField, formState: { errors, isValid, isDirty }, handleSubmit, getValues
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
      <form
        onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-2 gap-y-4 w-full"
      >
        <FormField label={{ name: "Никнейм", for: "nickname" }} errorMessage={errors?.nickname?.message}>
          <Input
            id="nickname"
            autoComplete="new-password"
            autoCorrect="off"
            type="text"
            placeholder="игровой никнейм"
            className="!bg-shark-900"
            status={errors.nickname ? "error" : "default"}
            variant="minecraft"
            {...register("nickname")}
          />
        </FormField>
        <FormField errorMessage={errors?.password?.message} label={{ name: "Пароль", for: "password" }}>
          <div className="flex items-center gap-2 justify-center">
            <PasswordInput register={register} error={errors.password} />
            <PasswordVisibilityBadge />
          </div>
        </FormField>
        <FormField label={{ name: "Откуда узнал(-а) о проекте?", for: "findout" }} errorMessage={errors?.findout?.message} >
          <Input
            id="findout"
            type="text"
            placeholder="узнал от..."
            autoComplete="new-password"
            className="!bg-shark-900"
            status={errors.findout ? "error" : "default"}
            variant="minecraft"
            {...register("findout")}
          />
        </FormField>
        <FormField errorMessage={errors?.acceptRules?.message}>
          <div className="inline-flex gap-2 items-center">
            <label htmlFor="rules" className="flex items-center cursor-pointer relative">
              <input
                id="rules"
                type="checkbox"
                className="peer h-5 w-5 lg:h-6 lg:w-6 cursor-pointer transition-all appearance-none
                  rounded shadow hover:shadow-md border-[2px] border-shark-600 bg-shark-700 checked:bg-shark-900 checked:border-black"
                {...register("acceptRules")}
              />
              <CheckboxIcon />
            </label>
            <label className="select-none cursor-pointer " htmlFor="rules">
              <Typography className="text-[15px] break-words lg:text-[18px]" textColor="shark_black">
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
        </FormField>
        <CloudflareTurnstile isDirty={isDirty} />
        <div className="flex flex-col sm:flex-row items-center justify-end w-full gap-2">
          <AuthStatus />
          <Button
            variant="minecraft" rounded="none" className="hover:bg-green-500 bg-green-600" disabled={isDisabled}
          >
            <Typography textSize="medium" font="minecraft" textColor="shark_white" className="text-lg">
              Зарегистрироваться
            </Typography>
          </Button>
        </div>
      </form>
    </>
  );
}, "SignUpForm")