import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
	const cookieStore = cookies();

	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
		{
			global: {
				fetch: (url: any, options = {}) => {
					return fetch(url, { ...options, cache: 'no-store' });
				}
			},
			cookies: {
				get(name: string) {
					return cookieStore.get(name)?.value
				},

				set(name: string, value: string, options: CookieOptions) {
					try {
						cookieStore.set({ name, value, ...options })
					} catch (error) {}
				},

				remove(name: string, options: CookieOptions) {
					try {
						cookieStore.set({ name, value: '', ...options })
					} catch (error) {}
				},
			},
		}
	)
}