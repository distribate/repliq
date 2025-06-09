import { Typography } from '@repo/ui/src/components/typography'
import { SignInForm } from '#components/auth/components/sign-in'
import { SignUpForm } from '#components/auth/components/sign-up'
import {
  detailsVisibilityAtom,
  referrerAtom,
  authTypeAtom
} from '#components/auth/models/auth.model'
import { reatomComponent, useUpdate } from '@reatom/npm-react'
import { authRoute } from '#routes/root-routes'
import { Head } from '@unhead/react'
import { wrapTitle } from '@repo/lib/utils/wrap-title'
import { FORUM_SITE_DOMAIN } from '@repo/shared/constants/origin-list'
import { CustomLink } from '#components/shared/link'
import LogotypeImage from "@repo/assets/images/logotype.png"

export type AuthSearch = Partial<{
  from: string
  redirect: string
}>

const Forms = reatomComponent(({ ctx }) => {
  const authType = ctx.spy(authTypeAtom)

  const toggleAuthType = () => authTypeAtom(ctx, (state) => state === 'login' ? "register" : "login")

  return (
    <div
      data-variant={ctx.spy(detailsVisibilityAtom)}
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
      <div className="flex flex-col sm:flex-row items-center mt-2 gap-4 justify-center w-full text-shark-100">
        {authType === 'login' && (
          <>
            <Typography className="cursor-pointer">
              Забыли пароль?
            </Typography>
            <span className="hidden sm:inline font-[Minecraft] relative top-0.5 select-none text-shark-300">⏹</span>
          </>
        )}
        <Typography onClick={toggleAuthType} className="cursor-pointer">
          {authType === 'login' ? 'Создать аккаунт' : 'Войти в аккаунт'}
        </Typography>
      </div>
    </div>
  )
}, "Forms")

const Logotype = reatomComponent(({ ctx }) => {
  return (
    <CustomLink
      to="/"
      data-variant={ctx.spy(detailsVisibilityAtom)}
      className={`overflow-hidden data-[variant=hidden]:opacity-0 select-none data-[variant=visible]:opacity-100`}
    >
      <img src={LogotypeImage} alt="Fasberry" width={128} height={128} draggable={false} className="" />
    </CustomLink>
  )
}, "Logotype")

const SyncParams = () => {
  const referrer = authRoute.useSearch({ select: (params) => params.from })

  useUpdate((ctx) => {
    if (referrer) {
      referrerAtom(ctx, referrer)
    }
  }, [])

  return null;
}

const AuthHead = () => {
  return (
    <Head>
      <title>{wrapTitle("Авторизация")}</title>
      <link rel="canonical" href={`${FORUM_SITE_DOMAIN}/auth`} />
      <meta property="og:description" content="Fasberry - майнкрафт сервер" />
      <meta property="og:url" content={`${FORUM_SITE_DOMAIN}/auth`} />
      <meta property="og:image" content="https://kong.fasberry.su/storage/v1/object/public/static/auth_background/8.png" />
    </Head>
  )
}

export function AuthRouteComponent() {
  return (
    <div className="flex flex-col h-screen w-full items-center justify-center gap-12 px-2 md:px-4 py-6 relative">
      <AuthHead />
      <SyncParams />
      <Logotype />
      <div className="flex flex-col items-center w-full">
        <Forms />
      </div>
    </div>
  )
}