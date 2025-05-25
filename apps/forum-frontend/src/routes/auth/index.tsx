import { redirect } from '@tanstack/react-router'
import { PageWrapper } from '#components/wrappers/components/page-wrapper'
import { AuthImage } from '#components/forms/auth/components/auth-image.tsx'
import { Typography } from '@repo/ui/src/components/typography'
import { SignInForm } from '#components/forms/auth/components/sign-in.tsx'
import { createFileRoute } from '@tanstack/react-router'
import { SignUpForm } from '#components/forms/auth/components/sign-up.tsx'
import {
  authGlobalOptionsAtom,
  authTypeAtom
} from '#components/forms/auth/models/auth.model'
import { Eye, EyeOff } from 'lucide-react'
import { validatePage } from "@repo/lib/utils/validate-page.ts"
import { reatomLoader } from '@repo/lib/utils/reatom-loader'
import { reatomComponent } from '@reatom/npm-react'

type AuthSearch = {
  from?: string
  redirect?: string
}

export const Route = createFileRoute('/auth/')({
  component: RouteComponent,
  beforeLoad: reatomLoader(async (context) => {
    const isValid = await validatePage(context)
    if (isValid) throw redirect({ to: '/' })
  }),
  head: () => ({ meta: [{ title: 'Авторизация' }] }),
  validateSearch: (search: Record<string, unknown>): AuthSearch => ({
    from: search.from as string ?? undefined,
    redirect: search.redirect as string ?? undefined,
  }),
})

const AuthControlPanel = reatomComponent(({ ctx }) => {
  const detailsVisibility = ctx.spy(authGlobalOptionsAtom).detailsVisibility

  return (
    <div
      onClick={() => authGlobalOptionsAtom(ctx, (state) => ({ ...state, detailsVisibility: state.detailsVisibility === 'hidden' ? 'visible' : 'hidden' }))}
      className="flex items-center select-none justify-end absolute z-[5] right-4 bottom-4"
    >
      <div className="flex items-center justify-center w-8 h-8 cursor-pointer bg-shark-800 rounded-lg">
        {detailsVisibility === 'hidden' ? <EyeOff size={20} /> : <Eye size={20} />}
      </div>
    </div>
  )
}, "AuthControlPanel")

const Forms = reatomComponent(({ ctx }) => {
  const authType = ctx.spy(authTypeAtom)
  const detailsVisibility = ctx.spy(authGlobalOptionsAtom).detailsVisibility

  const toggleAuthType = () => authTypeAtom(ctx, (state) => state === 'login' ? "register" : "login")

  return (
    <div
      className={`flex flex-col p-4 md:p-6 lg:p-8 gap-y-2 md:gap-y-4 lg:gap-y-6 min-w-[200px]
        w-full relative border-4 border-shark-600 bg-shark-200 overflow-y-auto transition-opacity ease-in-out duration-300
        ${detailsVisibility === 'hidden' ? "opacity-0" : "opacity-100"}`}
    >
      {authType === 'login' && (
        <>
          <div className="flex flex-col items-center gap-y-1">
            <h2 className="text-shark-950 text-xl lg:text-2xl xl:text-4xl font-semibold">
              Вход в аккаунт
            </h2>
            <Typography
              textColor="shark_black"
              textSize="small"
              className="font-normal text-center"
            >
              (используй свои игровые данные, чтобы войти в аккаунт)
            </Typography>
          </div>
          <SignInForm />
        </>
      )}
      {authType === 'register' && (
        <>
          <div className="flex flex-col items-center gap-y-1">
            <h2 className="text-shark-950 text-xl lg:text-2xl xl:text-4xl font-semibold">
              Регистрация аккаунта
            </h2>
          </div>
          <SignUpForm />
        </>
      )}
      <Typography
        onClick={toggleAuthType}
        className="self-end relative text-shark-900 cursor-pointer"
      >
        {authType === 'login'
          ? 'Нет аккаунта? Зарегистрироваться'
          : 'Уже зарегистрирован? Войти'
        }
      </Typography>
    </div>
  )
}, "Forms")

const Logotype = reatomComponent(({ ctx }) => {
  const detailsVisibility = ctx.spy(authGlobalOptionsAtom).detailsVisibility

  return (
    <div
      className={`flex relative w-full md:w-2/4 lg:w-1/3 overflow-hidden transition-opacity ease-in-out duration-300
      ${detailsVisibility === 'hidden' ? 'opacity-0' : 'opacity-100'}`}
    >
      <img
        src="/images/fasberry_logo.webp"
        alt="Fasberry"
        width={512}
        height={256}
        draggable={false}
        loading="eager"
        className="h-full w-full"
      />
    </div>
  )
}, "Logotype")

function RouteComponent() {
  return (
    <PageWrapper className="flex flex-col bg-cover !px-2 md:!px-4 py-6 relative *:font-[Minecraft]">
      <AuthImage />
      <AuthControlPanel />
      <div className="absolute inset-0 bg-black/40" />
      <Logotype />
      <div className="flex flex-col gap-4 w-full md:w-2/3 lg:2/4 xl:w-2/5">
        <Forms />
      </div>
    </PageWrapper>
  )
}