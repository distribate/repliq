import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	CREATE_THREAD_COMMENT_QUERY_KEY,
	CreateThreadCommentQuery
} from "../queries/create-thread-comment-query.ts";
import { postThreadComment } from "../queries/post-thread-comment.ts";
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { toast } from "@repo/ui/src/hooks/use-toast.ts";
import { THREAD_COMMENTS_QUERY_KEY } from '../../../thread/components/thread-comments/queries/thread-comments-query.ts';

export const useCreateThreadComment = () => {
	const qc = useQueryClient();
	const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY)
	
	const updateCreateThreadCommentMutation = useMutation({
		mutationFn: async ({ values, formState, repliedValues, type }: CreateThreadCommentQuery) => {
			qc.setQueryData(CREATE_THREAD_COMMENT_QUERY_KEY, (prev: CreateThreadCommentQuery) =>
				prev ? {
					...prev,
					type: type ?? prev.type,
					values: { ...prev.values, ...values },
					formState: { ...prev.formState, ...formState },
					repliedValues: { ...prev.repliedValues, ...repliedValues }
				} : prev,
			)
		},
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: CREATE_THREAD_COMMENT_QUERY_KEY })
		},
		onError: (e) => {throw new Error(e.message)}
	})
	
	const createThreadCommentMutation = useMutation({
		mutationFn: async (
			thread_id: string
		) => {
			if (!currentUser || !thread_id) return;
			
			const threadComment = qc.getQueryData<CreateThreadCommentQuery>(
				CREATE_THREAD_COMMENT_QUERY_KEY
			)
			
			const values = threadComment?.values;
			const content = values?.content;
			const type = threadComment?.type || "single";
			const recipient = threadComment?.repliedValues?.comment_id;
			
			if (!content) return;
			
			const threadCommentId = await postThreadComment({
				thread_id,
				user_nickname: currentUser.nickname,
				content,
				recipient_comment_id: recipient,
				type: type
			})
			
			if (!threadCommentId) {
				toast({
					title: "Что-то пошло не так!", variant: "negative"
				})
				
				return;
			}
			
			return { threadCommentId, thread_id };
		},
		onSuccess: async (data) => {
			if (data && data.threadCommentId) {
				toast({
					title: "Опубликовано",
					variant: "positive"
				})
				
				await Promise.all([
					qc.invalidateQueries({ queryKey: THREAD_COMMENTS_QUERY_KEY(data.thread_id) }),
					qc.resetQueries({ queryKey: CREATE_THREAD_COMMENT_QUERY_KEY })
				])
			}
		},
		onError: (e) => {
			console.error(e.message)
			throw new Error(e.message);
		}
	})
	
	return { updateCreateThreadCommentMutation, createThreadCommentMutation }
}