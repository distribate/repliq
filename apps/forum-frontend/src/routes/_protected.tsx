import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { ResizableLayout } from "#components/layout/resizable-layout.tsx"
import { CURRENT_USER_QUERY_KEY } from '@repo/lib/queries/current-user-query';
import { getUserInformation } from '@repo/lib/queries/get-user-information';
import { validateSession } from '@repo/lib/actions/validate-session';
import { AUTH_FLAG_QUERY_KEY } from '#components/modals/action-confirmation/components/logout/hooks/use-logout';
import HardcodeHeart from "@repo/assets/gifs/hardcore-heart-minecraft.gif"
import { PageWrapper } from '#components/wrappers/page-wrapper';
import { globalOptionQuery } from '@repo/lib/queries/global-option-query';
import { StartPreview } from '#components/get-start/start-preview';
import { Typography } from '@repo/ui/src/components/typography';
import { isProduction } from '@repo/lib/helpers/is-production';

type ErrorComponentProps = {
  error: Error
  reset: () => void
}

const ErrorComponent = ({
  error, reset
}: ErrorComponentProps) => {
  return (
    <PageWrapper className="flex flex-col gap-12">
      <img src={HardcodeHeart} alt="" width={144} height={144} className="max-w-1/3 max-h-1/3" />
      <div className="flex flex-col items-center justify-center gap-4">
        <Typography className="text-xl font-[Minecraft] text-white">
          Произошла ошибка! Пожалуйста, перезагрузите страницу.
        </Typography>
        {!isProduction && (
          <pre className="w-fit bg-shark-800 truncate rounded-lg px-2 py-1">
            <code>{error.message.slice(0, 256)}</code>
          </pre>
        )}
        <div
          onClick={reset}
          className="flex py-1 px-4 rounded-lg bg-shark-50 cursor-pointer items-center gap-1 justify-between"
        >
          <Typography className="text-[18px] font-semibold font-[Minecraft] text-shark-900">
            Починить
          </Typography>
        </div>
      </div>
    </PageWrapper>
  )
}

export const Route = createFileRoute('/_protected')({
  component: RouteComponent,
  beforeLoad: async ({ context: ctx, location }) => {
    let isAuthenticated = false;

    const cache = ctx.queryClient.getQueryData<boolean>(AUTH_FLAG_QUERY_KEY)

    if (!cache) {
      isAuthenticated = await validateSession();

      ctx.queryClient.setQueryData(AUTH_FLAG_QUERY_KEY, isAuthenticated)
    } else {
      isAuthenticated = cache;
    }

    if (!isAuthenticated) {
      // @ts-ignore
      throw redirect({ to: '/auth', search: { redirect: location.href, }, })
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
  errorComponent: ({ error, reset }) => <ErrorComponent error={error} reset={reset} />
})


function RouteComponent() {
  const { data: { isStarted } } = globalOptionQuery()

  if (isStarted) return <StartPreview />

  return (
    <ResizableLayout>
      <Outlet />
    </ResizableLayout>
  )
}