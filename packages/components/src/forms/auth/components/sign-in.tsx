import { Input } from "@repo/ui/src/components/input.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormField } from "@repo/ui/src/components/form-field.tsx";
import { ErrorField } from "@repo/ui/src/components/form.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { authorizationSchema } from "../schemas/authorization-schema.ts";
import { useMutationState, useQueryClient } from "@tanstack/react-query";
import { AUTH_MUTATION_KEY, useAuth } from "../hooks/use-auth.tsx";
import { AUTH_QUERY_KEY, AuthQuery, authQuery } from "../queries/auth-query.ts";
import { GearLoader } from "@repo/ui/src/components/gear-loader.tsx";
import EnderPearl from "@repo/assets/images/minecraft/ender_pearl.webp";
import EyeOfEnder from "@repo/assets/images/minecraft/eye_of_ender.webp";
import type { PasswordVisibilityType } from "#forms/auth/types/form-types.ts";
import { z } from "zod";

type zodSignInForm = z.infer<typeof authorizationSchema>;

export const SignInForm = () => {
  const qc = useQueryClient();
  const { data: { status } } = authQuery();
  const [pt, setPt] = useState<PasswordVisibilityType>("password");
  const { setAuthValuesMutation } = useAuth();

  const mutData = useMutationState({
    filters: { mutationKey: AUTH_MUTATION_KEY },
    select: m => m.state.status,
  });

  const isLoading = mutData[mutData.length - 1] === "pending";

  const { register, handleSubmit, resetField, formState: { errors, isValid }, getValues } = useForm<zodSignInForm>({
    mode: "onChange",
    resolver: zodResolver(authorizationSchema),
    defaultValues: { password: "", nickname: "" },
  });

  useEffect(() => {
    switch (status) {
      case "Nickname invalid":
        return resetField("nickname");
      case "Unsafe password":
        return resetField("password");
    }
  }, [status]);

  const onSubmit = () => {
    const values = getValues();
    const { nickname, password } = values;

    qc.setQueryData(AUTH_QUERY_KEY, (prev: AuthQuery) => ({
      ...prev,
      type: "sign-in",
      values: { nickname, password },
    }));

    setAuthValuesMutation.mutate();
  };

  const handlePasswordVisibility = () => {
    if (pt === "password") {
      setPt("text");
    } else {
      setPt("password");
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
        label={{ name: "Пароль", for: "password" }}
        errorMessage={errors?.password?.message}
      >
        <div className="flex items-center gap-2 justify-center">
          <Input
            id="password"
            type={pt}
            className="!bg-shark-900"
            placeholder="игровой пароль"
            autoComplete="new-password"
            status={errors.password ? "error" : "default"}
            variant="minecraft"
            {...register("password")}
          />
          <img
            className="cursor-pointer"
            src={pt === "password" ? EnderPearl : EyeOfEnder}
            alt=""
            width={36}
            height={36}
            loading="lazy"
            onClick={handlePasswordVisibility}
          />
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
            font="minecraft"
            textSize="medium"
            textColor="shark_white"
            className="uppercase font-semibold"
          >
            Войти в аккаунт
          </Typography>
        </Button>
        {isLoading && <GearLoader />}
      </div>
      {status && (
        status !== "Success" ? <ErrorField message={status} />
          : (
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