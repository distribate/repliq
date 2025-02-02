import { redirect } from '@tanstack/react-router'
import { FactSection } from '@repo/components/src/forms/auth/components/fact-section.tsx'
import { PageWrapper } from '@repo/components/src/wrappers/page-wrapper.tsx'
import { AuthImage } from '@repo/components/src/forms/auth/components/auth-image.tsx'
import { Typography } from '@repo/ui/src/components/typography'
import { SignInForm } from '@repo/components/src/forms/auth/components/sign-in.tsx'
import { SignInTip } from '@repo/components/src/forms/auth/components/sign-in-tip.tsx'
import { validateSession } from '@repo/lib/actions/validate-session'
import { lazy, Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from '@repo/ui/src/components/skeleton'
import { AUTH_FLAG_QUERY_KEY } from '@repo/components/src/modals/action-confirmation/components/logout/hooks/use-logout';

const SignUpForm = lazy(() =>
  import('@repo/components/src/forms/auth/components/sign-up.tsx').then(
    (m) => ({ default: m.SignUpForm }),
  ),
)

const SignUpTip = lazy(() =>
  import('@repo/components/src/forms/auth/components/sign-up-tip.tsx').then(
    (m) => ({ default: m.SignUpTip }),
  ),
)

export const Route = createFileRoute('/auth/')({
  component: RouteComponent,
  beforeLoad: async ({ context: ctx }) => {
    let isAuthenticated: boolean = false;

    const cache = ctx.queryClient.getQueryData<boolean>(AUTH_FLAG_QUERY_KEY)

    if (!cache) {
      isAuthenticated = await validateSession()

      ctx.queryClient.setQueryData(AUTH_FLAG_QUERY_KEY, isAuthenticated)
    } else {
      isAuthenticated = cache;
    }

    if (isAuthenticated) {
      throw redirect({
        to: '/'
      })
    }
  },
  head: () => ({
    meta: [{ title: 'Авторизация' }],
  }),
  validateSearch: (search) => {
    return {
      type: (search.type as 'login' | 'register') || 'login',
    }
  },
})

function RouteComponent() {
  // @ts-ignore
  const { type } = Route.useSearch()

  const isSignIn = type === 'login'
  const isSignUp = type === 'register'

  return (
    <PageWrapper className="flex flex-col bg-cover !px-2 md:!px-4 py-6 relative">
      <AuthImage />
      <div className="absolute inset-0 bg-black/40" />
      <div className="flex relative max-w-[1024px] max-h-[256px] overflow-hidden">
        <img
          src="/images/fasberry_logo.webp"
          alt="Fasberry"
          width={956}
          height={216}
          draggable={false}
          loading="eager"
          className="w-full h-full"
        />
      </div>
      <div
        className="flex flex-col p-4 md:p-6 lg:p-8 min-h-[320px] mt-6 lg:-mt-8 max-h-dvh xl:max-h-[540px]
        gap-y-2 md:gap-y-4 lg:gap-y-6 min-w-[200px] max-w-[1020px] outline-none relative
				minecraft-panel mb-8 lg:mb-6 *:font-[Minecraft] overflow-y-scroll"
      >
        {isSignIn && (
          <>
            <SignInFormTitle />
            <div className="flex flex-col lg:flex-row w-full gap-2 *:w-full">
              <SignInForm />
              <SignInTip />
            </div>
          </>
        )}
        {isSignUp && (
          <>
            <SignUpFormTitle />
            <div className="flex flex-col lg:flex-row w-full gap-4 *:w-full">
              <Suspense fallback={<Skeleton className="h-96" />}>
                <SignUpForm />
              </Suspense>
              <Suspense fallback={<Skeleton className="h-64" />}>
                <SignUpTip />
              </Suspense>
            </div>
          </>
        )}
      </div>
      <FactSection />
    </PageWrapper>
  )
}

const SignInFormTitle = () => {
  return (
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
  )
}

const SignUpFormTitle = () => {
  return (
    <div className="flex flex-col items-center gap-y-1">
      <h2 className="text-shark-950 text-xl lg:text-2xl xl:text-4xl font-semibold">
        Регистрация аккаунта
      </h2>
    </div>
  )
}
