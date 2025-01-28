import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { ResizableLayout } from "@repo/components/src/layouts/resizable-layout.tsx"
import { UserStatusLayout } from "@repo/components/src/layouts/user-status-layout.tsx";
import { CURRENT_USER_QUERY_KEY } from '@repo/lib/queries/current-user-query';
import { getUserInformation } from '@repo/lib/queries/get-user-information';
import { getCookieByKey } from '@repo/lib/helpers/get-cookie-by-key';
import { validateSession } from '@repo/lib/actions/validate-session';

export const Route = createFileRoute('/_protected')({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
    const isAuthenticated = await validateSession()

    if (!isAuthenticated) {
      throw redirect({
        to: '/auth',
        search: {
          type: "login",
          // @ts-expect-error
          redirect: location.href,
        },
      })
    }
  },
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery({
      queryKey: CURRENT_USER_QUERY_KEY,
      queryFn: () => getUserInformation()
    });
  },
  staleTime: 60_000,
  shouldReload: false
})

function RouteComponent() {
  const layout = getCookieByKey("react-resizable-panels:layout");

  let defaultLayout;

  if (layout) defaultLayout = JSON.parse(layout);

  return (
    <UserStatusLayout>
      <ResizableLayout defaultLayout={defaultLayout}>
        <Outlet />
      </ResizableLayout>
    </UserStatusLayout>
  )
}