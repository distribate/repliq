import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { ResizableLayout } from "@repo/components/src/layouts/resizable-layout.tsx"
import { CURRENT_USER_QUERY_KEY } from '@repo/lib/queries/current-user-query';
import { getUserInformation } from '@repo/lib/queries/get-user-information';
import { validateSession } from '@repo/lib/actions/validate-session';
import { AUTH_FLAG_QUERY_KEY } from '@repo/components/src/modals/action-confirmation/components/logout/hooks/use-logout';
// @ts-ignore
import HardcodeHeart from "@repo/assets/gifs/hardcore-heart-minecraft.gif"
import { PageWrapper } from '@repo/components/src/wrappers/page-wrapper';
import { Typography } from '@repo/ui/src/components/typography';
import { lazy, useState, Suspense } from 'react';

const BetaModal = lazy(() => import('@repo/components/src/modals/custom/beta-modal')
  .then(mod => ({ default: mod.BetaModal })))

export const Route = createFileRoute('/_protected')({
  component: RouteComponent,
  beforeLoad: async ({ context: ctx, location }) => {
    let isAuthenticated: boolean = false;

    const cache = ctx.queryClient.getQueryData<boolean>(AUTH_FLAG_QUERY_KEY)

    if (!cache) {
      isAuthenticated = await validateSession();

      ctx.queryClient.setQueryData(AUTH_FLAG_QUERY_KEY, isAuthenticated)
    } else {
      isAuthenticated = cache;
    }

    if (!isAuthenticated) {
      throw redirect({
        to: '/auth',
        search: {
          type: "login",
          // @ts-ignore
          redirect: location.href,
        },
      })
    }
  },
  loader: async ({ context: ctx }) => {
    const isAuthenticated = ctx.queryClient.getQueryData<boolean>(AUTH_FLAG_QUERY_KEY)

    if (isAuthenticated) {
      await ctx.queryClient.ensureQueryData({
        queryKey: CURRENT_USER_QUERY_KEY, queryFn: getUserInformation,
      })
    }
  },
  pendingMinMs: 0,
  pendingComponent: undefined,
  onCatch: ({ message, stack }) => console.error(message, stack),
  errorComponent: ({ error, reset }) => {
    return (
      <PageWrapper className="flex flex-col gap-y-12">
        <div className="flex overflow-hidden rounded-md">
          <img
            src={HardcodeHeart}
            alt=""
            width={144}
            height={144}
            loading="lazy"
            className="max-w-1/3 max-h-1/3"
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-y-4">
          <p className="text-xl font-[Minecraft] text-white">
            Произошла ошибка! Пожалуйста, перезагрузите страницу.
          </p>
          {process.env.NODE_ENV !== 'production' && (
                              <pre className="w-fit bg-shark-800 truncate rounded-lg px-2 py-1">
                              <code>
                                {error.message.slice(0, 256)}
                              </code>
                            </pre>
          )}
          <div onClick={reset} className="flex py-1 px-4 rounded-lg bg-shark-50 cursor-pointer items-center gap-1 justify-between backdrop-blur-md overflow-hidden">
            <p className="text-[18px] font-semibold font-[Minecraft] text-shark-900">
              Перезагрузить
            </p>
          </div>
        </div>
      </PageWrapper>
    )
  },
})

const BetaBadge = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    !isExpanded ? (
      <div onClick={() => setIsExpanded(true)} className="fixed bottom-4 right-4 flex items-center p-2 z-[555] rounded-lg bg-shark-100 gap-1 cursor-pointer">
        <Typography className="text-[20px]">
          💥
        </Typography>
      </div>
    ) : (
      <Suspense>
        <BetaModal open={isExpanded} onClose={() => setIsExpanded(false)} />
      </Suspense>
    )
  )
}

function RouteComponent() {
  return (
    <ResizableLayout>
      <BetaBadge />
      <Outlet />
    </ResizableLayout>
  )
}