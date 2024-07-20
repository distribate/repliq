import { ReactNode } from "react";
import { cookies } from "next/headers";
import { ResizableLayout } from "@repo/components/src/layouts/resizable-layout.tsx";
import { getCurrentUser } from "@repo/lib/actions/get-current-user.ts";
import { NotificationProvider } from "@repo/lib/providers/notification-provider.tsx";
import { permanentRedirect } from "next/navigation";
import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { CURRENT_USER_QUERY_KEY } from "@repo/lib/queries/current-user-query.ts";
import { getUserInformation } from "@repo/lib/queries/get-user-information.ts";
import { RESIZABLE_LAYOUT_COOKIE_KEY } from "@repo/shared/keys/cookie.ts";
import { AUTH_REDIRECT } from '@repo/shared/constants/routes.ts';

type MainLayoutProps = {
	children: ReactNode,
}

export default async function MainLayout({
	children
}: MainLayoutProps) {
	const qc = new QueryClient();
	
	const layout = cookies().get(
		RESIZABLE_LAYOUT_COOKIE_KEY
	);
	
	let defaultLayout: number[] | undefined;
	
	if (layout) {
		defaultLayout = JSON.parse(
			layout.value
		);
	}
	
	const currentUser = await getCurrentUser();
	
	if (!currentUser) permanentRedirect(AUTH_REDIRECT);
	
	await qc.prefetchQuery({
		queryKey: CURRENT_USER_QUERY_KEY,
		queryFn: () => getUserInformation()
	})

	return (
		<HydrationBoundary state={dehydrate(qc)}>
			<NotificationProvider nickname={currentUser.nickname} user_id={currentUser.id}>
				<ResizableLayout defaultLayout={defaultLayout}>
					{children}
				</ResizableLayout>
			</NotificationProvider>
		</HydrationBoundary>
	);
}