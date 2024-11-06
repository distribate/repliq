import { ReactNode } from 'react';
import { ResizableLayout } from '@repo/components/src/layouts/resizable-layout.tsx';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { redirect } from 'next/navigation';
import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query';
import { CURRENT_USER_QUERY_KEY } from '@repo/lib/queries/current-user-query.ts';
import { getUserInformation } from '@repo/lib/queries/get-user-information.ts';
import { AUTH_REDIRECT, BANNED_REDIRECT } from '@repo/shared/constants/routes.ts';
import { getUserBanned } from '@repo/lib/queries/get-user-banned.ts';
import { NotificationProvider } from '@repo/lib/providers/notification-provider.tsx';
import { getLayoutSizes } from '@repo/lib/helpers/get-layout-sizes.ts';

type MainLayoutProps = {
  children: ReactNode
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
  
  const defaultLayout = await getLayoutSizes()
  
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