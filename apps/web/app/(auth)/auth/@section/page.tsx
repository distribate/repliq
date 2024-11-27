import { SignUpForm } from '@repo/components/src/forms/auth/components/sign-up.tsx';
import { redirect } from 'next/navigation';
import { SignInForm } from '@repo/components/src/forms/auth/components/sign-in.tsx';
import { AUTH_REDIRECT } from '@repo/shared/constants/routes.ts';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { PageConventionProps } from '@repo/types/global';
import { SignUpTip } from '@repo/components/src/forms/auth/components/sign-up-tip.tsx';
import { SignInTip } from '@repo/components/src/forms/auth/components/sign-in-tip.tsx';

const SignInFormTitle = () => {
  return (
    <div className="flex flex-col items-center gap-y-1">
      <h2 className="text-shark-950 text-4xl font-semibold">
        Вход в аккаунт
      </h2>
      <Typography textColor="shark_black" textSize="small" className="font-normal">
        (используй свои игровые данные, чтобы войти в аккаунт)
      </Typography>
    </div>
  );
};

const SignUpFormTitle = () => {
  return (
    <div className="flex flex-col items-center gap-y-1">
      <h2 className="text-shark-950 text-4xl font-semibold">
        Регистрация аккаунта
      </h2>
      <Typography textColor="shark_black" textSize="small" className="font-normal">
        (используй свои существующие игровые данные, чтобы зарегистировать аккаунт)
      </Typography>
    </div>
  );
};

export default async function AuthSectionPage({
  searchParams,
}: PageConventionProps) {
  const { type } = searchParams;
  
  const isSignIn = type === 'login';
  const isSignUp = type === 'register';
  
  if (!type || (!isSignIn && !isSignUp)) {
    return redirect(AUTH_REDIRECT);
  }
  
  return (
    <div
      className="flex flex-col p-8 min-h-[320px] -mt-8 max-h-[540px] gap-y-6 min-w-[200px] max-w-[1020px] outline-none relative
				minecraft-panel mb-6 *:font-[Minecraft] overflow-y-scroll"
    >
      {isSignIn && (
        <>
          <SignInFormTitle />
          <div className="flex flex-col lg:flex-row w-full gap-2 *:w-full *:py-4 *:px-2">
            <SignInForm />
            <SignInTip />
          </div>
        </>
      )}
      {isSignUp && (
        <>
          <SignUpFormTitle />
          <div className="flex flex-col lg:flex-row w-full gap-4 *:w-full *:py-4 *:px-2">
            <SignUpForm />
            <SignUpTip />
          </div>
        </>
      )}
    </div>
  );
}