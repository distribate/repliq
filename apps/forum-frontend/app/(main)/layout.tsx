import { ReactNode } from "react";
import { ResizableLayout } from "@repo/components/src/layouts/resizable-layout.tsx";
import { redirect } from "next/navigation";
import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from "@tanstack/react-query";
import { CURRENT_USER_QUERY_KEY } from "@repo/lib/queries/current-user-query.ts";
import {
  AUTH_REDIRECT,
  BANNED_REDIRECT,
} from "@repo/shared/constants/routes.ts";
import { cookies } from "next/headers";
import { RESIZABLE_LAYOUT_COOKIE_KEY } from "@repo/shared/keys/cookie.ts";
import { getCurrentSession } from "@repo/lib/actions/get-current-session.ts";
import { forumUserClient } from "@repo/shared/api/forum-client";
import { UserDetailed } from "@repo/types/entities/user-type";

type MainLayoutProps = {
  children: ReactNode;
};

export async function getInitialCurrentUser(): Promise<UserDetailed | null> {
  const sessionToken = await cookies().get("session")?.value ?? null;
  if (!sessionToken) redirect(AUTH_REDIRECT);

  const res = await forumUserClient().user["get-me"].$get({}, {
    headers: {
      Cookie: `session=${sessionToken}`
    }
  })

  const data = await res.json()

  if (!data) {
    return null;
  }

  if ("error" in data) {
    const { error } = data;

    if (error === "You are banned") {
      redirect(BANNED_REDIRECT)
    }
    
    if (error === 'no result') {
      redirect("/not-online")
    }

    return null;
  }

  return data as UserDetailed
}

export default async function MainLayout({ children }: MainLayoutProps) {
  const { user: currentUser } = await getCurrentSession();
  if (!currentUser) return redirect(AUTH_REDIRECT);

  const qc = new QueryClient();

  await qc.prefetchQuery({ queryKey: CURRENT_USER_QUERY_KEY, queryFn: () => getInitialCurrentUser(), });

  const layout = cookies().get(RESIZABLE_LAYOUT_COOKIE_KEY);

  let defaultLayout;
  if (layout) defaultLayout = JSON.parse(layout.value);

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <ResizableLayout defaultLayout={defaultLayout}>
        {children}
      </ResizableLayout>
    </HydrationBoundary>
  );
}