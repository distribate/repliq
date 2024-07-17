import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyRequestOrigin } from "lucia";
import { updateSession } from '@repo/lib/utils/supabase/middleware'
import { ALERTS_COOKIE_KEY } from "@repo/shared/keys/cookie.ts"

export async function middleware(request: NextRequest) {
	if (request.method === "GET") return NextResponse.next();
	
	const hasAlertsShowing = request.cookies.has(ALERTS_COOKIE_KEY)
	// const sidebarFormat = request.cookies.has('sidebar');

	const response = NextResponse.next()

	// console.log(sidebarFormat)
	
	// if (!sidebarFormat) {
	// 	response.cookies.set('sidebar', 'dynamic');
	// }
	
	if (!hasAlertsShowing) {
		response.cookies.set(ALERTS_COOKIE_KEY, 'show');
	}
	
	const originHeader = request.headers.get("Origin");
	const hostHeader = request.headers.get("X-Forwarded-Host");
	
	if (!originHeader || !hostHeader || !verifyRequestOrigin(
		originHeader, [ hostHeader ])
	) {
		return new NextResponse(null, {
			status: 403
		});
	}
	
	await updateSession(request)
	
	return response;
}

export const config = {
	matcher: [
		'/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
	],
}