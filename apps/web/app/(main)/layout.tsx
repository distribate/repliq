import { ReactNode } from 'react';
import { ResizableLayout } from '@repo/components/src/layouts/resizable-layout.tsx';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { redirect } from 'next/navigation';
import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query';
import { CURRENT_USER_QUERY_KEY } from '@repo/lib/queries/current-user-query.ts';
import { getUserInformation } from '@repo/lib/queries/get-user-information.ts';
import { AUTH_REDIRECT, BANNED_REDIRECT } from '@repo/shared/constants/routes.ts';
import { getUserBanned } from '@repo/lib/queries/get-user-banned.ts';
import { cookies } from 'next/headers';
import { RESIZABLE_LAYOUT_COOKIE_KEY } from '@repo/shared/keys/cookie.ts';

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
  
  const layout = cookies().get(RESIZABLE_LAYOUT_COOKIE_KEY);
  
  let defaultLayout;
  if (layout) defaultLayout = JSON.parse(layout.value);
  
  return (
    <ResizableLayout defaultLayout={defaultLayout}>
      <HydrationBoundary state={dehydrate(qc)}>
        {children}
      </HydrationBoundary>
    </ResizableLayout>
  );
}