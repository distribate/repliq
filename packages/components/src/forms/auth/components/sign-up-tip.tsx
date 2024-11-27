"use client"

import { Typography } from '@repo/ui/src/components/typography.tsx';
import { AUTH_REDIRECT } from '@repo/shared/constants/routes.ts';
import { AUTH_QUERY_KEY } from '#forms/auth/queries/auth-query.ts';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const SignUpTip = () => {
  const qc = useQueryClient();
  const { replace } = useRouter();
  
  const handleRedirect = () => {
    replace(AUTH_REDIRECT);
    return qc.resetQueries({ queryKey: AUTH_QUERY_KEY });
  };
  
  return (
    <div className="flex flex-col mt-6 gap-y-4">
      <Typography textShadow="small" textSize="medium" textColor="shark_black" className="font-normal">
        Зарегистрируйся на форуме, чтобы создавать свой контент и с общаться с игроками в одной сети!
      </Typography>
      <div className="flex flex-col gap-y-1">
        <Typography textShadow="small" textSize="medium" className="font-semibold text-red-800">
          Внимание!
        </Typography>
        <Typography textShadow="small" textSize="medium" textColor="shark_black" className="font-normal">
          Никнейм чувствителен к регистру, иначе ты должен вводить игровой ник точь-в-точь с заглавными буквами
          (если они есть).
        </Typography>
      </div>
      <div className="w-full overflow-hidden">
        <Typography onClick={handleRedirect} textColor="shark_black" textSize="medium" variant="link">
          У меня уже есть аккаунт. Войти.
        </Typography>
      </div>
    </div>
  );
};