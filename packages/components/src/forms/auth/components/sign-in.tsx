'use client';

import { Input } from '@repo/ui/src/components/input.tsx';
import { Button } from '@repo/ui/src/components/button.tsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { FormField } from '@repo/ui/src/components/form-field.tsx';
import { FormAuthErrorMessage } from '@repo/ui/src/components/form.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { authorizationSchema } from '../schemas/authorization-schema.ts';
import { zodSignInForm } from '../types/error-message-type.ts';
import { useRouter } from 'next/navigation';
import { errorMessages } from '../constants/error-messages.ts';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/use-auth.tsx';
import { AUTH_QUERY_KEY, AuthQuery, authQuery } from '../queries/auth-query.ts';
import { GearLoader } from '@repo/ui/src/components/gear-loader.tsx';
import { SignTipProps } from '../types/form-types.ts';
import Image from 'next/image';
import EnderPearl from '@repo/assets/images/minecraft/ender_pearl.webp';
import EyeOfEnder from '@repo/assets/images/minecraft/eye_of_ender.webp';

const SignInTip = ({
  handleRedirect,
}: SignTipProps) => {
  return (
    <div className="flex flex-col mt-6 gap-y-4">
      <div className="flex flex-col gap-y-1">
        <Typography
          textSize="medium"
          textShadow="small"
          className="font-semibold text-red-800"
        >
          Внимание!
        </Typography>
        <Typography
          textSize="medium"
          textColor="shark_black"
          textShadow="small"
          className="font-normal"
        >
          Никнейм чувствителен к регистру, то есть ты должен вводить игровой ник точь-в-точь с заглавными буквами
          (если они есть).
        </Typography>
      </div>
      <div className="w-full overflow-hidden">
        <Typography
          textSize="medium"
          variant="link"
          textColor="shark_black"
          onClick={handleRedirect}
        >
          У меня нет аккаунта. Зарегистрироваться.
        </Typography>
      </div>
    </div>
  );
};

export const SignInForm = () => {
  const qc = useQueryClient();
  const { data: authState } = authQuery();
  const { setAuthValuesMutation } = useAuth();
  const { replace } = useRouter();
  const [ passwordType, setPasswordType ] = useState<'text' | 'password'>('password');
  
  const { register, handleSubmit, reset, resetField, formState: { errors, isValid } } = useForm<
    zodSignInForm
  >({
    mode: 'onSubmit',
    resolver: zodResolver(authorizationSchema),
    defaultValues: {
      password: '', nickname: '',
    },
  });
  
  const error = authState?.formState?.error;
  const status = authState.formState?.status;
  
  useEffect(() => {
    if (status === 204 || error === 'notFound') reset();
    if (error === 'incorrectPassword' && status === 400) resetField('password');
  }, [ authState?.formState ]);
  
  const onSubmit = ({
    nickname, password,
  }: Pick<NonNullable<AuthQuery['values']>, 'nickname' | 'password'>) => {
    return setAuthValuesMutation.mutate(
      { type: 'sign-in', values: { nickname, password }, },
      { onSuccess: async() => await qc.invalidateQueries({ queryKey: AUTH_QUERY_KEY }), },
    );
  };
  
  const handleRedirect = () => {
    replace('/auth?type=register');
    return qc.resetQueries({ queryKey: AUTH_QUERY_KEY });
  };
  
  return (
    <div className="flex flex-col lg:flex-row w-full gap-2 *:w-full *:py-4 *:px-2">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <FormField
          label={{ name: 'Никнейм', for: 'nickname' }}
          errorMessage={errors?.nickname?.message}
        >
          <Input
            id="nickname"
            type="text"
            placeholder="игровой ник"
            autoComplete="new-password"
            className="!bg-shark-900"
            status={errors.nickname ? 'error' : 'default'}
            variant="minecraft"
            {...register('nickname')}
          />
        </FormField>
        <FormField
          label={{ name: 'Пароль', for: 'password' }}
          errorMessage={errors?.password?.message}
        >
          <div className="flex items-center gap-2 justify-center">
            <Input
              id="password"
              type={passwordType}
              className="!bg-shark-900"
              placeholder="игровой пароль"
              autoComplete="new-password"
              status={errors.password ? 'error' : 'default'}
              variant="minecraft"
              onClick={() => {
                if (error && status === 400) return qc.resetQueries({ queryKey: AUTH_QUERY_KEY });
              }}
              {...register('password')}
            />
            {passwordType === 'password' ? (
              <Image className="cursor-pointer" src={EnderPearl} alt="" width={36} height={36}
                     onClick={() => setPasswordType('text')} />
            ) : (
              <Image className="cursor-pointer" src={EyeOfEnder} alt="" width={36} height={36}
                     onClick={() => setPasswordType('password')} />
            )}
          </div>
        </FormField>
        <div className="flex items-center gap-x-2">
          <Button
            variant="minecraft"
            rounded="none"
            className="hover:bg-pink-900 bg-pink-800"
            disabled={!isValid || setAuthValuesMutation.isPending}
          >
            <Typography textSize="medium" textColor="shark_white" className="uppercase font-semibold">
              Войти в аккаунт
            </Typography>
          </Button>
          {setAuthValuesMutation.isPending && <GearLoader />}
        </div>
        {error && <FormAuthErrorMessage type={error} messages={errorMessages} />}
        {error === 'alreadyOriginal' && (
          <div className="px-2">
            <Typography
              onClick={handleRedirect}
              textColor="shark_black"
              textSize="medium"
              variant="link"
            >
              Перейти к регистрации
            </Typography>
          </div>
        )}
      </form>
      <SignInTip handleRedirect={handleRedirect} />
    </div>
  );
};