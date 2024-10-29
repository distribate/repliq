import { deleteSession } from "@repo/lib/actions/delete-session.ts";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from 'next/navigation';
import { AUTH_REDIRECT } from '@repo/shared/constants/routes.ts';

export const LOGOUT_MUTATION_KEY = ["logout"]

export const useLogout = () => {
	const { push } = useRouter()
	
	const logOutMutation = useMutation({
		mutationKey: LOGOUT_MUTATION_KEY,
		mutationFn: async() => deleteSession(),
		onSuccess: async () => push(AUTH_REDIRECT),
		onError: (e) => {throw new Error(e.message);}
	})
	
	return { logOutMutation }
}