import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { ResizableLayout } from '@repo/components/src/layouts/resizable-layout.tsx';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { permanentRedirect, redirect } from 'next/navigation';
import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { CURRENT_USER_QUERY_KEY } from '@repo/lib/queries/current-user-query.ts';
import { getUserInformation } from '@repo/lib/queries/get-user-information.ts';
import { RESIZABLE_LAYOUT_COOKIE_KEY } from '@repo/shared/keys/cookie.ts';
import { AUTH_REDIRECT } from '@repo/shared/constants/routes.ts';
import { getUserBanned } from '@repo/lib/queries/get-user-banned.ts';

type MainLayoutProps = {
  children: ReactNode
}

export default async function MainLayout({
  children,
}: MainLayoutProps) {
  const qc = new QueryClient();
  const currentUser = await getCurrentUser();
  
  if (!currentUser) redirect(AUTH_REDIRECT);
  
  const layout = cookies().get(RESIZABLE_LAYOUT_COOKIE_KEY);
  
  let defaultLayout: number[] | undefined;
  
  if (layout) {
    defaultLayout = JSON.parse(layout.value);
  }
  
  const isBanned = await getUserBanned({
    nickname: currentUser.nickname
  })
  
  if (isBanned && isBanned.nickname === currentUser.nickname) redirect("/banned");
  
  await qc.prefetchQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: () => getUserInformation(),
  });
  
  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <ResizableLayout defaultLayout={defaultLayout}>
        {children}
      </ResizableLayout>
    </HydrationBoundary>
  );
}