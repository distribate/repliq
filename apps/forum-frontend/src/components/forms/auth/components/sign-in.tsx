import { Input } from "@repo/ui/src/components/input.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormField } from "@repo/ui/src/components/form-field.tsx";
import { ErrorField } from "@repo/ui/src/components/form.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { authorizationSchema } from "../schemas/authorization-schema.ts";
import { useMutationState, useQueryClient } from "@tanstack/react-query";
import { AUTH_MUTATION_KEY, useAuth } from "../hooks/use-auth.tsx";
import { AUTH_QUERY_KEY, authGlobalOptionsQuery, AuthQuery, authQuery } from "../queries/auth-query.ts";
import { GearLoader } from "@repo/ui/src/components/gear-loader.tsx";
import { z } from "zod";
import { PasswordVisibilityBadge } from "./password-visibility-badge.tsx";
import Turnstile from "react-turnstile";
import { isProduction } from "@repo/lib/helpers/is-production.ts";

export const SignInForm = () => {
  const qc = useQueryClient();
  const { data } = authQuery();
  const { setAuthValuesMutation } = useAuth();
  const { data: { passwordVisibility } } = authGlobalOptionsQuery()

  const mutData = useMutationState({
    filters: { mutationKey: AUTH_MUTATION_KEY }, select: m => m.state.status,
  });

  const isLoading = mutData[mutData.length - 1] === "pending";

  const {
    register, handleSubmit, resetField, setValue, formState: { errors, isValid, isDirty }, getValues
  } = useForm<z.infer<typeof authorizationSchema>>({
    mode: "onChange",
    resolver: zodResolver(authorizationSchema),
    defaultValues: { password: "", nickname: "" }
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

    qc.setQueryData(AUTH_QUERY_KEY, (prev: AuthQuery) => ({ ...prev, ...values }));

    setAuthValuesMutation.mutate();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col p-2 gap-y-4 w-full"
    >
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
          <Input
            id="password"
            type={passwordVisibility}
            className="!bg-shark-900"
            placeholder="игровой пароль"
            autoComplete="new-password"
            autoCorrect="off"
            status={errors.password ? "error" : "default"}
            variant="minecraft"
            {...register("password")}
          />
          <PasswordVisibilityBadge />
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
            font="minecraft"
            textSize="medium"
            textColor="shark_white"
            className="text-lg"
          >
            Войти в аккаунт
          </Typography>
        </Button>
        {isLoading && <GearLoader />}
      </div>
      {data?.status && (
        data?.status !== "Success" ? (
          <ErrorField message={data?.status} />
        ) : (
          <div className="px-2">
            <Typography
              textColor="shark_black"
              textSize="medium"
              variant="link"
            >
              Входим в аккаунт...
            </Typography>
          </div>
        )
      )}
    </form>
  );
};