import { ReactNode } from "react";
import { validateRequest } from "@repo/lib/utils/auth/validate-requests.ts";
import { redirect } from "next/navigation";
import { checkAdminPermission } from "@repo/lib/actions/check-admin-permission.ts";

type AdminLayoutProps = {
	tickets: ReactNode,
	children: ReactNode,
	reports: ReactNode
}

export default async function AdminLayout({
	tickets, children, reports
}: AdminLayoutProps) {
	
	const { user, session } = await validateRequest()
	
	const isAdmin = await checkAdminPermission()
	
	if (!user || !session || !isAdmin) redirect("/");
	
	return (
		<div className="w-full flex h-full">
			{tickets}
			{reports}
			{children}
		</div>
	)
}