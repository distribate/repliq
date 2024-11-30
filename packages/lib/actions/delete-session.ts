"use server"

import { permanentRedirect } from "next/navigation";
import { AUTH_REDIRECT } from '@repo/shared/constants/routes.ts';
import { getCurrentSession } from '#actions/get-current-session.ts';
import { deleteSessionTokenCookie } from '#actions/session-control.ts';

export async function deleteSession(): Promise<{ error: string | null }> {
	const { session } = await getCurrentSession();

	if (!session) {
		return { error: "Unauthorized..." };
	}

	await deleteSessionTokenCookie()
	
	permanentRedirect(AUTH_REDIRECT);
}