import { PageWrapper } from '#components/wrappers/components/page-wrapper'
import { Typography } from '@repo/ui/src/components/typography'
import { SignInForm } from '#components/forms/auth/components/sign-in.tsx'
import { SignUpForm } from '#components/forms/auth/components/sign-up.tsx'
import {
  authDetailsVisibilityAtom,
  authReferrerAtom,
  authTypeAtom
} from '#components/forms/auth/models/auth.model'
// import { Eye, EyeOff } from 'lucide-react'
import { reatomComponent, useUpdate } from '@reatom/npm-react'
// import { CustomLink } from '#components/shared/link'
import { authRoute } from '#routes/root-routes'
import { Head } from '@unhead/react'
import { wrapTitle } from '@repo/lib/utils/wrap-title'

export type AuthSearch = Partial<{
  from: string
  redirect: string
}>

// const AuthControlPanel = reatomComponent(({ ctx }) => {
//   const detailsVisibility = ctx.spy(authDetailsVisibilityAtom)

//   return (
//     <div
//       onClick={() => authDetailsVisibilityAtom(ctx, (state) => state === 'hidden' ? 'visible' : 'hidden')}
//       className="flex items-center select-none justify-end absolute z-[5] right-4 bottom-4"
//     >
//       <div className="flex items-center justify-center w-10 h-10 cursor-pointer bg-shark-900 rounded-md">
//         {detailsVisibility === 'hidden' ? <EyeOff size={20} /> : <Eye size={20} />}
//       </div>
//     </div>
//   )
// }, "AuthControlPanel")

const Forms = reatomComponent(({ ctx }) => {
  const authType = ctx.spy(authTypeAtom)

  const toggleAuthType = () => authTypeAtom(ctx, (state) => state === 'login' ? "register" : "login")

  return (
    <div
      data-variant={ctx.spy(authDetailsVisibilityAtom)}
      className={`flex flex-col p-4 md:p-8 gap-y-2 md:gap-y-4 lg:gap-y-6
        w-full md:min-w-[500px] lg:min-w-[620px] md:w-fit relative border-2 bg-shark-950/10 border-shark-900 overflow-y-auto rounded-2xl
        data-[variant=hidden]:opacity-0 data-[variant=visible]:opacity-100`}
    >
      {authType === 'login' && (
        <>
          <div className="flex flex-col items-center gap-y-1">
            <h2 className="text-shark-100 text-xl lg:text-2xl xl:text-3xl font-semibold">
              Вход в аккаунт
            </h2>
          </div>
          <SignInForm />
        </>
      )}
      {authType === 'register' && (
        <>
          <div className="flex flex-col items-center gap-y-1">
            <h2 className="text-shark-100 text-xl lg:text-2xl xl:text-3xl font-semibold">
              Регистрация аккаунта
            </h2>
          </div>
          <SignUpForm />
        </>
      )}
      <div className="flex items-center mt-2 gap-4 justify-center w-full text-shark-100">
        {authType === 'login' && (
          <>
            <Typography className="cursor-pointer">
              Забыли пароль?
            </Typography>
            <span className="font-[Minecraft] relative top-0.5 select-none text-shark-300">⏹</span>
          </>
        )}
        <Typography onClick={toggleAuthType} className="cursor-pointer">
          {authType === 'login' ? 'Создать аккаунт' : 'Войти в аккаунт'}
        </Typography>
      </div>
    </div>
  )
}, "Forms")

// const Logotype = reatomComponent(({ ctx }) => {
//   return (
//     <CustomLink
//       to="/"
//       data-variant={ctx.spy(authDetailsVisibilityAtom)}
//       className={`flex relative w-full md:w-2/4 lg:w-1/3 overflow-hidden
//         data-[variant=hidden]:opacity-0 data-[variant=visible]:opacity-100`}
//     >
//       <img src="/images/fasberry_logo.webp" alt="Fasberry" width={512} height={256} draggable={false} className="h-full w-full" />
//     </CustomLink>
//   )
// }, "Logotype")

const SyncParams = () => {
  const referrer = authRoute.useSearch({ select: (params) => params.from }) as string | undefined;
  useUpdate((ctx) => authReferrerAtom(ctx, referrer), [referrer])
  return null;
}

const AuthHead = () => {
  return (
    <Head>
      <title>{wrapTitle("Авторизация")}</title>
      <link rel="canonical" href="https://hub.fasberry.su/auth" />
      <meta property="og:description" content="Fasberry - майнкрафт сервер" />
      <meta property="og:url" content="https://hub.fasberry.su/auth" />
      <meta property="og:image" content="https://kong.fasberry.su/storage/v1/object/public/static/auth_background/8.png" />
    </Head>
  )
}

export function AuthRouteComponent() {
  return (
    <PageWrapper className="flex flex-col !px-2 md:!px-4 py-6 relative">
      <AuthHead />
      <SyncParams />
      <div className="flex flex-col items-center gap-4 w-full">
        <Forms />
      </div>
    </PageWrapper>
  )
}