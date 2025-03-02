import { FormField } from "@repo/ui/src/components/form-field.tsx";
import { Input } from "@repo/ui/src/components/input.tsx";
import { useForm } from "react-hook-form";
import { Button } from "@repo/ui/src/components/button.tsx";
import { useSearch } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema } from "../schemas/authorization-schema.ts";
import { useEffect } from "react";
import { ErrorField } from "@repo/ui/src/components/form.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { useMutationState, useQueryClient } from "@tanstack/react-query";
import { AUTH_MUTATION_KEY, useAuth } from "../hooks/use-auth.tsx";
import { AUTH_QUERY_KEY, AUTH_TYPE_QUERY_KEY, authGlobalOptionsQuery, AuthQuery, authQuery } from "../queries/auth-query.ts";
import { GearLoader } from "@repo/ui/src/components/gear-loader.tsx";
import { z } from "zod";
import { Link } from "@tanstack/react-router";
import Turnstile from "react-turnstile";
import { isProduction } from "@repo/lib/helpers/is-production.ts";
import { PasswordVisibilityBadge } from "./password-visibility-badge.tsx";

export const SignUpForm = () => {
  const qc = useQueryClient();
  const { data } = authQuery();
  const { setAuthValuesMutation } = useAuth();
  const { data: { passwordVisibility } } = authGlobalOptionsQuery()

  const referrer = useSearch({
    from: "/auth/", select: (params) => params.from
  }) as string | undefined;

  const mutData = useMutationState({
    filters: { mutationKey: AUTH_MUTATION_KEY }, select: m => m.state.status,
  });

  const isLoading = mutData[mutData.length - 1] === "pending";

  const { 
    register,resetField, formState: { errors, isValid, isDirty },  setValue, handleSubmit, getValues
  } = useForm<z.infer<typeof registrationSchema>>({
    mode: "onChange",
    resolver: zodResolver(registrationSchema),
    defaultValues: { password: "", nickname: "", findout: "", acceptRules: false },
  });

  useEffect(() => {
    switch (data?.status) {
      case "Nickname invalid":
        return resetField("nickname");
      case "Unsafe password":
        return resetField("password");
    }
  }, [data?.status]);

  const onSubmit = () => {
    const values = getValues();

    qc.setQueryData(AUTH_QUERY_KEY, (prev: AuthQuery) => ({ ...prev, ...values, referrer }));

    setAuthValuesMutation.mutate();
  };

  const handleRedirect = () => {
    qc.setQueryData(AUTH_TYPE_QUERY_KEY, "login");
    qc.resetQueries({ queryKey: AUTH_QUERY_KEY });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col p-2 gap-y-4 w-full"
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
          <Input
            id="password"
            type={passwordVisibility}
            autoComplete="new-password"
            autoCorrect="off"
            className="!bg-shark-900"
            placeholder="пароль"
            status={errors.password ? "error" : "default"}
            variant="minecraft"
            {...register("password")}
          />
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
                strokeWidth="1"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </span>
          </label>
          <label className="select-none cursor-pointer " htmlFor="rules">
            <Typography className="text-[15px] break-words lg:text-[18px]" textColor="shark_black">
              Согласен с&nbsp;
              <Link
                to="https://fasberry.su/rules"
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
      {(isProduction && isDirty) && (
        <Turnstile
          sitekey="0x4AAAAAAA-stfNqE6yrheDS"
          onVerify={token => setValue("token", token)}
          className="self-end"
        />
      )}
      <div className="flex items-center justify-end w-full gap-x-2">
        <Button
          variant="minecraft"
          rounded="none"
          className="hover:bg-green-500 bg-green-600"
          disabled={!isValid || isLoading}
        >
          <Typography
            textSize="medium"
            font="minecraft"
            textColor="shark_white"
            className="text-lg"
          >
            Зарегистрироваться
          </Typography>
        </Button>
        {isLoading && <GearLoader />}
      </div>
      {data?.status && (
        data?.status !== 'Success' ? (
          <ErrorField message={data?.status} />
        ) : (
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
        )
      )}
    </form>
  );
};