"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@repo/ui/src/hooks/use-toast.ts";
import { REQUESTS_INCOMING_QUERY_KEY } from "../../../../friends/queries/requests-incoming-query.ts";
import { REQUESTS_OUTGOING_QUERY_KEY } from "../../../../friends/queries/requests-outgoing-query.ts";
import { REQUESTS_QUERY_KEY } from "../../../../friends/queries/requests-query.ts";
import { FRIENDS_QUERY_KEY } from "../../../../friends/queries/friends-query.ts";
import { removeFriend } from "../queries/remove-friend-from-list.ts";
import { removeFriendRequest } from "../queries/remove-friend-request.ts";
import { createFriendRequest } from "../queries/create-friend-request.ts";

type AddFriend = {
	currentUserNickname: string,
	requestedUserNickname: string
}

export const useControlFriend = () => {
	const qc = useQueryClient();
	
	const handleSuccess = async(variables: AddFriend) => {
		await Promise.all([
			qc.invalidateQueries({
				queryKey: REQUESTS_QUERY_KEY(variables.currentUserNickname)
			}),
			qc.invalidateQueries({
				queryKey: FRIENDS_QUERY_KEY(variables.currentUserNickname)
			}),
			qc.invalidateQueries({
				queryKey: REQUESTS_INCOMING_QUERY_KEY(variables.currentUserNickname)
			}),
			qc.invalidateQueries({
				queryKey: REQUESTS_OUTGOING_QUERY_KEY(variables.currentUserNickname)
			})
		])
	}
	
	const removeRequestMutation = useMutation({
		mutationFn: async({
			currentUserNickname, requestedUserNickname
		}: AddFriend) => {
			const { data, error, status } = await removeFriendRequest({
				initiator: currentUserNickname, recipient: requestedUserNickname
			})
			
			if (status === 200) {
				toast({
					title: "Заявка была отменена.", variant: "positive"
				})
			}
			
			if (error || status !== 200) {
				toast({
					title: "Произошла ошибка. Попробуйте позже", variant: "negative"
				})
			}
			
			return data;
		},
		onSuccess: async(data, variables, context) => {
			await handleSuccess(variables)
		},
		onError: (e) => {throw new Error(e.message);}
	})
	
	const addRequestFriendMutation = useMutation({
		mutationFn: async({
			currentUserNickname, requestedUserNickname
		}: AddFriend) => {
			const { data, error, status } = await createFriendRequest({
				initiator: currentUserNickname, recipient: requestedUserNickname
			})
			
			if (status === 201) {
				toast({
					title: "Заявка была отправлена.", variant: "positive"
				})
			}
			
			if (error || status !== 201) {
				toast({
					title: "Произошла ошибка. Попробуйте позже", variant: "negative"
				})
			}
			
			return data;
		},
		onSuccess: async(data, variables, context) => {
			await handleSuccess(variables)
		},
		onError: (e) => {throw new Error(e.message);}
	})
	
	const removeFriendFromListMutation = useMutation({
		mutationFn: async({
			currentUserNickname, requestedUserNickname
		}: AddFriend) => {
			const { status, error } = await removeFriend(
				currentUserNickname, requestedUserNickname
			)
			
			if (status === 204) {
				toast({
					title: "Игрок удалён из друзей", variant: "positive"
				})
			}
			
			if (error || status !== 204) {
				toast({
					title: "Произошла ошибка. Попробуйте позже", variant: "negative"
				})
			}
		},
		onSuccess: async(data, variables, context) => {
			await handleSuccess(variables)
		},
		onError: (e) => { throw new Error(e.message) }
	})
	
	return { addRequestFriendMutation, removeRequestMutation, removeFriendFromListMutation }
}