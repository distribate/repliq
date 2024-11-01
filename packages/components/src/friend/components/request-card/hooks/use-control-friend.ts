"use client"

import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner";
import { deleteFriend } from "../queries/delete-friend.ts";
import { createFriendRequest } from "../queries/create-friend-request.ts";
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { deleteFriendRequest } from '../queries/delete-friend-request.ts';
import { SEARCHING_FRIENDS_QUERY_KEY } from '../../../../friends/queries/searching-friends-query.ts';
import {
	REQUESTS_OUTGOING_QUERY_KEY
} from '../../../../friends/queries/requests-outgoing-query.ts';
import { REQUESTS_QUERY_KEY } from '../../../../friends/queries/requests-query.ts';
import { FRIENDS_QUERY_KEY, FriendsQuery } from '../../../../friends/queries/friends-query.ts';
import { REQUESTS_INCOMING_QUERY_KEY } from '../../../../friends/queries/requests-incoming-query.ts';
import { setPinFriend } from '../../../../friends/queries/set-pin-friend.ts';
import { setUnpinFriend } from '../../../../friends/queries/set-unpin-friend.ts';
import { setNoteFriend } from '../../../../friends/queries/set-note-friend.ts';
import { setUnNoteFriend } from '../../../../friends/queries/set-unnote-friend.ts';

type ControlFriendProperties = {
	reqUserNickname: string;
	friend_id?: string;
};

type SetFriendNote = ControlFriendProperties & {
	note: string;
};

export const USER_FRIEND_DELETE_MUTATION_KEY = ["user-friend-delete-list"]

export const useControlFriend = () => {
	const qc = useQueryClient();
	const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY)
	const friends = qc.getQueryData<FriendsQuery[]>(FRIENDS_QUERY_KEY(currentUser?.nickname))
	
	const invalidateAllRequests = async() => {
		await Promise.all([
			qc.invalidateQueries({ queryKey: REQUESTS_QUERY_KEY(currentUser?.nickname) }),
			qc.invalidateQueries({ queryKey: SEARCHING_FRIENDS_QUERY_KEY(currentUser?.nickname) }),
			qc.invalidateQueries({ queryKey: FRIENDS_QUERY_KEY(currentUser?.nickname) }),
			qc.invalidateQueries({ queryKey: REQUESTS_INCOMING_QUERY_KEY(currentUser?.nickname) }),
			qc.invalidateQueries({ queryKey: REQUESTS_OUTGOING_QUERY_KEY(currentUser?.nickname) })
		])
	}
	
	const handleFriendAction = async (
		action: Function,
		successMessage: string,
		errorMessage: string,
		invalidateKey?: QueryKey,
	) => {
		try {
			const { status } = await action();
			
			if (status === 200 || status === 204 || status === 201) {
				toast.success(successMessage);
				
				if (invalidateKey) {
					return qc.invalidateQueries({ queryKey: invalidateKey });
				}
			} else {
				return toast.error(errorMessage);
			}
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(error.message);
			}
		}
	};
	
	const resolveFriendId = (reqUserNickname: string, friend_id?: string) => {
		if (friend_id) return friend_id;
		
		const friend = friends?.find(
			fd => fd.nickname === reqUserNickname
		);
		
		return friend?.friend_id || null;
	};
	
	const setFriendUnNoteMutation = useMutation({
		mutationFn: async ({ reqUserNickname, friend_id }: Omit<SetFriendNote, "note">) => {
			const id = resolveFriendId(reqUserNickname, friend_id);
			
			if (!id) return;
			
			await handleFriendAction(
				() => setUnNoteFriend({
					friend_id: id, recipient: reqUserNickname
				}),
				"Заметка удалена.",
				"Произошла ошибка. Попробуйте позже",
				FRIENDS_QUERY_KEY(currentUser?.nickname)
			);
		},
		onSuccess: async () => qc.invalidateQueries({ queryKey: FRIENDS_QUERY_KEY(currentUser?.nickname) }),
		onError: (e) => { throw new Error(e.message) },
	})
	
	const setFriendNoteMutation = useMutation({
		mutationFn: async ({ reqUserNickname, friend_id, note }: SetFriendNote) => {
			const id = resolveFriendId(reqUserNickname, friend_id);
			
			if (!id || !note) return;
			
			const isNoted = friends?.some(
				fd => fd.friend_id === id && !!fd.note
			) || false;
			
			await handleFriendAction(
				() => setNoteFriend({
					friend_id: id, note, isNoted, recipient: reqUserNickname
				}),
				"Заметка добавлена.",
				"Произошла ошибка. Попробуйте позже",
				FRIENDS_QUERY_KEY(currentUser?.nickname)
			);
		},
		onSuccess: async () => qc.invalidateQueries({ queryKey: FRIENDS_QUERY_KEY(currentUser?.nickname) }),
		onError: (e) => { throw new Error(e.message) },
	});
	
	const setFriendUnpinMutation = useMutation({
		mutationFn: async ({ reqUserNickname, friend_id }: ControlFriendProperties) => {
			const id = resolveFriendId(reqUserNickname, friend_id);
			
			if (!id) return;
			
			await handleFriendAction(
				() => setUnpinFriend({
					friend_id: id, recipient: reqUserNickname
				}),
				"Игрок откреплен.",
				"Произошла ошибка. Попробуйте позже",
				FRIENDS_QUERY_KEY(currentUser?.nickname)
			);
		},
		onSuccess: async () => qc.invalidateQueries({ queryKey: FRIENDS_QUERY_KEY(currentUser?.nickname) }),
		onError: (e) => { throw new Error(e.message) },
	});
	
	const setFriendPinnedMutation = useMutation({
		mutationFn: async ({ reqUserNickname, friend_id }: ControlFriendProperties) => {
			const id = resolveFriendId(reqUserNickname, friend_id);
			
			if (!id) return;
			
			await handleFriendAction(
				() => setPinFriend({
					friend_id: id, recipient: reqUserNickname
				}),
				"Игрок закреплен.",
				"Произошла ошибка. Попробуйте позже",
				FRIENDS_QUERY_KEY(currentUser?.nickname)
			);
		},
		onSuccess: invalidateAllRequests,
		onError: (e) => { throw new Error(e.message) },
	});
	
	const deleteRequestMutation = useMutation({
		mutationFn: async ({ reqUserNickname, friend_id }: ControlFriendProperties) => {
			const id = resolveFriendId(reqUserNickname, friend_id);
			
			if (!id) return;
			
			await handleFriendAction(
				() => deleteFriendRequest(id),
				"Заявка была отменена.",
				"Произошла ошибка. Попробуйте позже",
				REQUESTS_QUERY_KEY(currentUser?.nickname)
			);
		},
		onSuccess: invalidateAllRequests,
		onError: (e) => { throw new Error(e.message) }
	});
	
	const createRequestFriendMutation = useMutation({
		mutationFn: async ({ reqUserNickname }: ControlFriendProperties) => {
			await handleFriendAction(
				() => createFriendRequest(reqUserNickname),
				"Заявка была отправлена.",
				"Произошла ошибка. Попробуйте позже",
				REQUESTS_QUERY_KEY(currentUser?.nickname)
			);
		},
		onSuccess: invalidateAllRequests,
		onError: (e) => { throw new Error(e.message) }
	});
	
	const removeFriendFromListMutation = useMutation({
		mutationKey: USER_FRIEND_DELETE_MUTATION_KEY,
		mutationFn: async ({ reqUserNickname, friend_id }: ControlFriendProperties) => {
			const id = resolveFriendId(reqUserNickname, friend_id);
			
			if (!id) return;
			
			await handleFriendAction(
				() => deleteFriend(id),
				"Игрок удалён из друзей.",
				"Произошла ошибка. Попробуйте позже",
				FRIENDS_QUERY_KEY(currentUser?.nickname)
			);
		},
		onSuccess: invalidateAllRequests,
		onError: (e) => { throw new Error(e.message) }
	});
	
	return {
		createRequestFriendMutation,
		deleteRequestMutation,
		removeFriendFromListMutation,
		setFriendPinnedMutation,
		setFriendUnpinMutation,
		setFriendUnNoteMutation,
		setFriendNoteMutation
	}
}