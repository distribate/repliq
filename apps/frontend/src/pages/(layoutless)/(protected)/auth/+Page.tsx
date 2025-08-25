import { Typography } from '@repo/ui/src/components/typography'
import { SignInForm } from '#components/auth/components/sign-in'
import { SignUpForm } from '#components/auth/components/sign-up'
import {
  referrerAtom,
  authTypeAtom
} from '#components/auth/models/auth.model'
import { reatomComponent, useUpdate } from '@reatom/npm-react'
import { CustomLink } from '#shared/components/link'
import { usePageContext } from 'vike-react/usePageContext'

const Forms = reatomComponent(({ ctx }) => {
  const type = ctx.spy(authTypeAtom);
  const toggle = () => authTypeAtom(ctx, (state) => state === 'login' ? "register" : "login")

  return (
    <div
      className="flex flex-col p-3 sm:p-4 md:p-8 gap-2 md:gap-4 
        border bg-shark-900/40 border-shark-900 overflow-y-auto rounded-xl
        w-full md:min-w-[496px] lg:min-w-[624px] md:w-fit"
    >
      {type === 'login' && (
        <>
          <div className="flex flex-col items-center gap-y-1">
            <h2 className="text-shark-50 text-xl lg:text-2xl xl:text-3xl font-semibold">
              Вход в аккаунт
            </h2>
          </div>
          <SignInForm />
        </>
      )}
      {type === 'register' && (
        <>
          <div className="flex flex-col items-center gap-y-1">
            <h2 className="text-shark-50 text-xl lg:text-2xl xl:text-3xl font-semibold">
              Регистрация аккаунта
            </h2>
          </div>
          <SignUpForm />
        </>
      )}
      <div className="flex flex-col sm:flex-row items-center mt-2 gap-4 justify-center w-full text-shark-100">
        {type === 'login' && (
          <>
            <CustomLink to="/restore" className="hover:underline hover:decoration-1">
              <Typography className="cursor-pointer">
                Забыли пароль?
              </Typography>
            </CustomLink>
            <span className="hidden sm:inline space-grotesk relative top-0.5 select-none text-shark-300">⏹</span>
          </>
        )}
        <Typography className="cursor-pointer hover:underline hover:decoration-1" onClick={toggle}>
          {type === 'login' ? 'Создать аккаунт' : 'Войти в аккаунт'}
        </Typography>
      </div>
    </div>
  )
}, "Forms")

const Logotype = reatomComponent(({ ctx }) => {
  return (
    <CustomLink to="/" className="overflow-hidden select-none">
      <img src="/logotype.png" alt="Repliq" width={128} height={128} draggable={false} className="" />
    </CustomLink>
  )
}, "Logotype")

const SyncReferrerParam = () => {
  const search = usePageContext().urlParsed.search as { from?: string }

  useUpdate((ctx) => {
    const referrer = search.from;

    referrerAtom(ctx, referrer ?? null)
  }, [search])

  return null;
}

export default function AuthPage() {
  return (
    <div className="flex flex-col min-h-[90dvh] w-full items-center justify-center gap-12 px-2 relative">
      <SyncReferrerParam />
      <Logotype />
      <Forms />
    </div>
  )
}