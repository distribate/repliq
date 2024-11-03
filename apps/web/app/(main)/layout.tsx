import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { ResizableLayout } from '@repo/components/src/layouts/resizable-layout.tsx';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { redirect } from 'next/navigation';
import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query';
import { CURRENT_USER_QUERY_KEY } from '@repo/lib/queries/current-user-query.ts';
import { getUserInformation } from '@repo/lib/queries/get-user-information.ts';
import { RESIZABLE_LAYOUT_COOKIE_KEY } from '@repo/shared/keys/cookie.ts';
import { AUTH_REDIRECT, BANNED_REDIRECT } from '@repo/shared/constants/routes.ts';
import { getUserBanned } from '@repo/lib/queries/get-user-banned.ts';
import { NotificationProvider } from '@repo/lib/providers/notification-provider.tsx';

type MainLayoutProps = {
  children: ReactNode
}

const DEFAULT_LAYOUT_SIZES = [ 16, 84 ];

function getLayoutSizes(): number[] {
  const layout = cookies().get(RESIZABLE_LAYOUT_COOKIE_KEY);
  return layout ? JSON.parse(layout.value) as number[] : DEFAULT_LAYOUT_SIZES;
}

export default async function MainLayout({
  children,
}: MainLayoutProps) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return redirect(AUTH_REDIRECT);
  
  const isBanned = await getUserBanned(currentUser.nickname);
  if (isBanned && isBanned.nickname === currentUser.nickname) return redirect(BANNED_REDIRECT);
  
  const qc = new QueryClient();
  
  await qc.prefetchQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: () => getUserInformation(),
  });
  
  const defaultLayout = getLayoutSizes()
  
  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NotificationProvider>
        <ResizableLayout defaultLayout={defaultLayout}>
          {children}
        </ResizableLayout>
      </NotificationProvider>
    </HydrationBoundary>
  );
}