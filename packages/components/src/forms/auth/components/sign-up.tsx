"use client";

import { FormField } from "@repo/ui/src/components/form-field.tsx";
import { Input } from "@repo/ui/src/components/input.tsx";
import { useForm } from "react-hook-form";
import { Button } from "@repo/ui/src/components/button.tsx";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema } from "../schemas/authorization-schema.ts";
import { useEffect, useState } from "react";
import { FormAuthErrorMessage } from "@repo/ui/src/components/form.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { useMutationState, useQueryClient } from "@tanstack/react-query";
import { errorMessages } from "../constants/error-messages.ts";
import { AUTH_MUTATION_KEY, useAuth } from "../hooks/use-auth.tsx";
import { AUTH_QUERY_KEY, AuthQuery, authQuery } from "../queries/auth-query.ts";
import Link from "next/link";
import { GearLoader } from "@repo/ui/src/components/gear-loader.tsx";
import EnderPearl from "@repo/assets/images/minecraft/ender_pearl.webp";
import EyeOfEnder from "@repo/assets/images/minecraft/eye_of_ender.webp";
import type { PasswordVisibilityType } from "#forms/auth/types/form-types.ts";
import { z } from "zod";

type zodSignUpForm = z.infer<typeof registrationSchema>;

export const SignUpForm = () => {
  const qc = useQueryClient();
  const { data: authState } = authQuery();
  const [passwordType, setPasswordType] =
    useState<PasswordVisibilityType>("password");
  const { setAuthValuesMutation } = useAuth();
  const { replace } = useRouter();

  const mutData = useMutationState({
    filters: { mutationKey: AUTH_MUTATION_KEY },
    select: (m) => m.state.status,
  });

  const isLoading = mutData[mutData.length - 1] === "pending";
  const status = authState.status;
  const isError = status !== "created";

  const {
    register,
    resetField,
    formState: { errors, isValid },
    handleSubmit,
    reset,
    getValues,
  } = useForm<zodSignUpForm>({
    mode: "onSubmit",
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      password: "",
      nickname: "",
      findout: "",
      acceptRules: false,
    },
  });

  useEffect(() => {
    switch (status) {
      case "notFound":
        return reset();
      case "incorrectPassword":
        return resetField("password");
    }
  }, [status]);

  const onSubmit = () => {
    const values = getValues();
    const { password, acceptRules, findout, nickname, realName } = values;

    if (!acceptRules) return;

    qc.setQueryData(AUTH_QUERY_KEY, (prev: AuthQuery) => ({
      ...prev,
      type: "sign-up",
      values: { nickname, password, acceptRules, findout, realName },
    }));

    setAuthValuesMutation.mutate();
  };

  const handleRedirect = () => {
    replace("/auth?type=login");
    return qc.resetQueries({ queryKey: AUTH_QUERY_KEY });
  };

  const handlePasswordVisibility = () => {
    if (passwordType === "password") {
      setPasswordType("text");
    } else {
      setPasswordType("password");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col py-2 lg:px-2 lg:py-4 gap-y-4">
      <FormField
        label={{ name: "Никнейм", for: "nickname" }}
        errorMessage={errors?.nickname?.message}
      >
        <Input
          id="nickname"
          type="text"
          placeholder="игровой ник"
          autoComplete="new-password"
          className="!bg-shark-900"
          status={errors.nickname ? "error" : "default"}
          variant="minecraft"
          {...register("nickname")}
        />
      </FormField>
      <FormField
        errorMessage={errors?.password?.message}
        label={{ name: "Пароль", for: "password" }}
      >
        <div className="flex items-center gap-2 justify-center">
          <Input
            id="password"
            type={passwordType}
            className="!bg-shark-900"
            placeholder="игровой пароль"
            autoComplete="new-password"
            status={errors.password ? "error" : "default"}
            variant="minecraft"
            {...register("password")}
          />
          <img
            className="cursor-pointer"
            src={passwordType === "password" ? EnderPearl.src : EyeOfEnder.src}
            alt=""
            width={36}
            height={36}
            loading="lazy"
            onClick={handlePasswordVisibility}
          />
        </div>
      </FormField>
      <FormField
        label={{ name: "Реальное имя", for: "realName" }}
        errorMessage={errors?.realName?.message}
      >
        <Input
          id="realName"
          type="text"
          className="!bg-shark-900"
          placeholder="например: Данил"
          autoComplete="new-password"
          status={errors.realName ? "error" : "default"}
          variant="minecraft"
          {...register("realName")}
        />
      </FormField>
      <FormField
        label={{ name: "Откуда узнал(-а) о проекте?", for: "findout" }}
        errorMessage={errors?.findout?.message}
      >
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
          <label
            htmlFor="rules"
            className="flex items-center cursor-pointer relative"
          >
            <input
              id="rules"
              type="checkbox"
              className="peer h-5 w-5 lg:h-6 lg:w-6 cursor-pointer transition-all appearance-none
                  rounded shadow hover:shadow-md border-[2px] border-shark-600 bg-shark-700 checked:bg-shark-900 checked:border-black"
              {...register("acceptRules")}
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
                stroke-width="1"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </span>
          </label>
          <label className="select-none cursor-pointer " htmlFor="rules">
            <Typography className="text-[15px] break-words lg:text-[18px]" textColor="shark_black">
              Согласен с&nbsp;
              <Link
                href="/misc/rules"
                target="_blank"
                className="underline underline-offset-4"
              >
                правилами
              </Link>
              &nbsp;проекта
            </Typography>
          </label>
        </div>
      </FormField>
      <div className="flex items-center gap-x-2">
        <Button
          variant="minecraft"
          rounded="none"
          className="hover:bg-pink-900 bg-pink-800"
          disabled={!isValid || isLoading}
        >
          <Typography
            textSize="medium"
            font="minecraft"
            textColor="shark_white"
            className="uppercase font-semibold"
          >
            Зарегистрироваться
          </Typography>
        </Button>
        {isLoading && <GearLoader />}
      </div>
      {isError && (
        <FormAuthErrorMessage type={status} messages={errorMessages} />
      )}
      {status === "created" && (
        <div className="px-2">
          <Typography
            onClick={handleRedirect}
            textColor="shark_black"
            textSize="medium"
            variant="link"
          >
            Перейти к авторизации
          </Typography>
        </div>
      )}
    </form>
  );
};
