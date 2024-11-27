'use client';

import { FormField } from '@repo/ui/src/components/form-field.tsx';
import { Input } from '@repo/ui/src/components/input.tsx';
import { useForm } from 'react-hook-form';
import { Button } from '@repo/ui/src/components/button.tsx';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema } from '../schemas/authorization-schema.ts';
import { useEffect, useState } from 'react';
import { FormAuthErrorMessage } from '@repo/ui/src/components/form.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { useMutationState, useQueryClient } from '@tanstack/react-query';
import { zodSignUpForm } from '../types/error-message-type.ts';
import { errorMessages } from '../constants/error-messages.ts';
import { AUTH_MUTATION_KEY, useAuth } from '../hooks/use-auth.tsx';
import { AUTH_QUERY_KEY, AuthQuery, authQuery } from '../queries/auth-query.ts';
import Link from 'next/link';
import { GearLoader } from '@repo/ui/src/components/gear-loader.tsx';
import EnderPearl from '@repo/assets/images/minecraft/ender_pearl.webp';
import EyeOfEnder from '@repo/assets/images/minecraft/eye_of_ender.webp';

export const SignUpForm = () => {
  const qc = useQueryClient();
  const { data: authState } = authQuery();
  const [ passwordType, setPasswordType ] = useState<'text' | 'password'>('password');
  const { setAuthValuesMutation } = useAuth();
  const { replace } = useRouter()
  
  const mutData = useMutationState({
    filters: { mutationKey: AUTH_MUTATION_KEY },
    select: mutation => mutation.state.status,
  });
  
  const isLoading = mutData[mutData.length - 1] === 'pending';
  
  const {
    register,
    resetField,
    formState: { errors, isValid },
    handleSubmit,
    reset,
    getValues,
  } = useForm<zodSignUpForm>({
    mode: 'onSubmit',
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      password: '', nickname: '', findout: '', acceptRules: false,
    },
  });
  
  useEffect(() => {
    if (status === 201 || error === 'notFound') {
      return reset();
    }
    
    if (error === 'incorrectPassword' && status === 400) {
      return resetField('password');
    }
  }, [ authState?.formState ]);
  
  const error = authState?.formState?.error;
  const status = authState.formState?.status;
  
  const onSubmit = () => {
    const values = getValues();
    const { password, acceptRules, findout, nickname, realName } = values;
    
    if (!acceptRules) return;
    
    qc.setQueryData(AUTH_QUERY_KEY, (prev: AuthQuery) => ({
      ...prev,
      type: 'sign-up',
      values: { nickname, password, acceptRules, findout, realName },
    }));
    
    setAuthValuesMutation.mutate();
  };
  
  const handleRedirect = () => {
    replace('/auth?type=login');
    return qc.resetQueries({ queryKey: AUTH_QUERY_KEY });
  };
  
  return (
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
        errorMessage={errors?.password?.message}
        label={{ name: 'Пароль', for: 'password' }}
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
            {...register('password')}
          />
          <img
            className="cursor-pointer"
            src={passwordType === 'password' ? EnderPearl.src : EyeOfEnder.src}
            alt=""
            width={36}
            height={36}
            loading="lazy"
            onClick={() => {
              if (passwordType === 'password') {
                setPasswordType('text');
              } else setPasswordType('password');
            }}
          />
        </div>
      </FormField>
      <FormField
        label={{ name: 'Реальное имя', for: 'realName' }}
        errorMessage={errors?.realName?.message}
      >
        <Input
          id="realName"
          type="text"
          className="!bg-shark-900"
          placeholder="например: Данил"
          autoComplete="new-password"
          status={errors.realName ? 'error' : 'default'}
          variant="minecraft"
          {...register('realName')}
        />
      </FormField>
      <FormField
        label={{ name: 'Откуда узнал(-а) о проекте?', for: 'findout' }}
        errorMessage={errors?.findout?.message}
      >
        <Input
          id="findout"
          type="text"
          placeholder="узнал от..."
          autoComplete="new-password"
          className="!bg-shark-900"
          status={errors.findout ? 'error' : 'default'}
          variant="minecraft"
          {...register('findout')}
        />
      </FormField>
      <FormField errorMessage={errors?.acceptRules?.message}>
        <div className="flex items-center gap-1">
          <input type="checkbox" id="rules" {...register('acceptRules')} />
          <Typography textSize="medium" textColor="shark_black">
            Согласен с&nbsp;
            <Link
              href="/misc/rules"
              target="_blank"
              className="underline underline-offset-4"
            >
              правилами
            </Link>
            &nbsp;пользования
          </Typography>
        </div>
      </FormField>
      <div className="flex items-center gap-x-2">
        <Button
          variant="minecraft"
          rounded="none"
          className="hover:bg-pink-900 bg-pink-800"
          disabled={!isValid || isLoading}
        >
							<span className="text-shark-50 text-md uppercase font-semibold">
                Зарегистрироваться
              </span>
        </Button>
        {isLoading && <GearLoader />}
      </div>
      {error && <FormAuthErrorMessage type={error} messages={errorMessages} />}
      {error === 'created' && (
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