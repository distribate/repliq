import { ReactNode } from "react";
import { validateRequest } from "@repo/lib/utils/auth/validate-requests.ts";
import { redirect } from "next/navigation";
import { checkAdminPermission } from "@repo/lib/actions/check-admin-permission.ts";
import { AdminNavigation } from '@repo/components/src/admin/components/navigation/admin-navigation.tsx';

type AdminLayoutProps = {
	tickets: ReactNode,
	children: ReactNode,
	reports: ReactNode,
	configs: ReactNode
}

export default async function AdminLayout({
	tickets, children, reports, configs
}: AdminLayoutProps) {
	const { user, session } = await validateRequest()
	
	const isAdmin = await checkAdminPermission()
	
	if (!user || !session || !isAdmin) {
		return redirect('/');
	}
	
	return (
		<div className="flex flex-col bg-shark-950 gap-6 p-2 rounded-[12px] w-full h-full">
			<AdminNavigation/>
			{configs}
			{tickets}
			{reports}
			{children}
		</div>
	)
}