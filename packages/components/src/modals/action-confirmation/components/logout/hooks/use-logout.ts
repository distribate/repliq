import { deleteSession } from "@repo/lib/actions/delete-session.ts";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from 'next/navigation';
import { AUTH_REDIRECT } from '@repo/shared/constants/routes.ts';
import { toast } from 'sonner';

export const LOGOUT_MUTATION_KEY = ["logout"]

export const useLogout = () => {
	const { push } = useRouter()
	
	const logoutMutation = useMutation({
		mutationKey: LOGOUT_MUTATION_KEY,
		mutationFn: async() => deleteSession(),
		onSuccess: () => push(AUTH_REDIRECT),
		onSettled: () => toast.info("Вы вышли из аккаунта"),
		onError: e => {throw new Error(e.message);}
	})
	
	return { logoutMutation }
}