'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteFriendRequest } from '../queries/delete-friend-request.ts';
import { toast } from 'sonner';
import { acceptFriendRequest } from '../queries/accept-friend-request.ts';
import { SEARCHING_FRIENDS_QUERY_KEY } from '#friends/queries/searching-friends-query.ts';
import { REQUESTS_INCOMING_QUERY_KEY, requestsIncomingQuery } from '#friends/queries/requests-incoming-query.ts';
import { REQUESTS_OUTGOING_QUERY_KEY, requestsOutgoingQuery } from '#friends/queries/requests-outgoing-query.ts';
import { REQUESTS_QUERY_KEY } from '#friends/queries/requests-query.ts';
import { FRIENDS_QUERY_KEY } from '#friends/queries/friends-query.ts';
import { getUser } from '@repo/lib/helpers/get-user.ts';
import { useRouter } from 'next/navigation';
import { USER_FRIEND_DELETE_MUTATION_KEY } from '#friend/components/friend-card/hooks/use-control-friend.ts';
import { ControlFriendProperties } from '#friend/components/friend-card/types/friend-request-types.ts';
import { createFriendRequest } from '#friend/components/friend-card/queries/create-friend-request.ts';
import { resolveFriendId } from '#friend/components/friend-card/helpers/resolve-friend-id.ts';
import { deleteFriend } from '#friend/components/friend-card/queries/delete-friend.ts';
import { UserFriends } from '#friends/queries/get-friends.ts';

export const useControlFriendRequests = () => {
  const qc = useQueryClient();
  const currentUser = getUser();
  const { refresh } = useRouter();
  
  const { data: outgoingRequests } = requestsOutgoingQuery();
  const { data: incomingRequests } = requestsIncomingQuery();
  
  const invalidateAllFriendsRequests = async() => {
    if (!currentUser) return;
    
    await Promise.all([
      qc.invalidateQueries({ queryKey: REQUESTS_INCOMING_QUERY_KEY(currentUser.nickname) }),
      qc.invalidateQueries({ queryKey: REQUESTS_QUERY_KEY(currentUser.nickname) }),
      qc.invalidateQueries({ queryKey: FRIENDS_QUERY_KEY(currentUser.nickname) }),
      qc.invalidateQueries({ queryKey: SEARCHING_FRIENDS_QUERY_KEY(currentUser.nickname) }),
      qc.invalidateQueries({ queryKey: REQUESTS_OUTGOING_QUERY_KEY(currentUser.nickname) }),
    ]);
  };
  
  const handleMutationSuccess = async(
    data: { status: number } | undefined,
    successMessage: string,
    errorMessage: string,
    refreshNeeded = false,
  ) => {
    if (!data) return toast.error("Произошла ошибка. Попробуйте позже")
    
    if (data && (data.status === 200 || data.status === 201 || data.status === 204)) {
      toast.success(successMessage);
      if (refreshNeeded) refresh();
      return invalidateAllFriendsRequests();
    } else {
      return toast.error('Произошла ошибка. Попробуйте позже', {
        description: errorMessage,
      });
    }
  };
  
  const acceptIncomingRequestMutation = useMutation({
    mutationFn: async(initiator: string) => {
      if (!currentUser || !incomingRequests) return;
      
      const incomingRequest = incomingRequests.find(
        fd => fd.recipient === currentUser.nickname
          && fd.initiator === initiator,
      );
      
      if (!incomingRequest) return;
      
      return acceptFriendRequest({ initiator, friend_id: incomingRequest.id });
    },
    onSuccess: async(data) => {
      return handleMutationSuccess(
        data, 'Заявка принята.', 'Попробуйте попытку позже', true
      );
    },
    onError: e => { throw new Error(e.message); },
  });
  
  const rejectIncomingRequestMutation = useMutation({
    mutationFn: async(initiator: string) => {
      if (!currentUser || !incomingRequests) return;
      
      const incomingRequest = incomingRequests.find(
        fd => fd.recipient === currentUser.nickname
          && fd.initiator === initiator,
      );
      
      if (!incomingRequest) return;
      
      return deleteFriendRequest(incomingRequest.id);
    },
    onSuccess: async(data) => {
      return handleMutationSuccess(
        data, 'Заявка отклонена.', 'Попробуйте попытку позже', false
      );
    },
    onError: e => { throw new Error(e.message);},
  });
  
  const rejectOutgoingRequestMutation = useMutation({
    mutationFn: async(initiator: string) => {
      if (!currentUser || !outgoingRequests) return;
      
      const outgoingRequest = outgoingRequests.find(
        fd => fd.initiator === currentUser.nickname
          && fd.recipient === initiator,
      );
      
      if (!outgoingRequest) return;
      
      return deleteFriendRequest(outgoingRequest.id);
    },
    onSuccess: async(data) => {
      return handleMutationSuccess(
        data, 'Заявка отозвана.', 'Попробуйте попытку позже', false
      );
    },
    onError: e => { throw new Error(e.message); },
  });
  
  const createRequestFriendMutation = useMutation({
    mutationFn: async(
      reqUserNickname: Pick<ControlFriendProperties, 'reqUserNickname'>['reqUserNickname'],
    ) => createFriendRequest(reqUserNickname),
    onSuccess: async(data) => {
      const createRequest = data;
      
      if (createRequest && createRequest.status === 201) {
        toast.success('Заявка отправлена');
        return invalidateAllFriendsRequests();
      } else if (createRequest && createRequest.error) {
        if (createRequest.error === 'blocked-by-user') {
          return toast.error('Невозможно добавить этого игрока в друзья', {
            description: "Этот пользователь вас заблокировал"
          });
        }
        
        if (createRequest.error === 'user-blocked') {
          return toast.error('Невозможно добавить этого игрока в друзья', {
            description: "Вы заблокировали данного пользователя"
          });
        }
        
        return toast.error('Произошла ошибка. Повторите попытку', {
          description: createRequest.error,
        });
      }
    },
    onError: e => { throw new Error(e.message); },
  });
  
  const removeFriendMutation = useMutation({
    mutationKey: USER_FRIEND_DELETE_MUTATION_KEY,
    mutationFn: async({ reqUserNickname, friend_id }: ControlFriendProperties) => {
      if (!currentUser) return;
      
      let friendId: string | null;
      
      if (friend_id) {
        friendId = friend_id;
      } else {
        const friends = qc.getQueryData<UserFriends[]>(FRIENDS_QUERY_KEY(currentUser.nickname));
        if (!friends) return;
        
        const friend = resolveFriendId(friends, reqUserNickname);
        if (!friend) return;
        
        friendId = friend.friend_id;
      }
      
      if (!friendId) return;
      
      return deleteFriend(friendId);
    },
    onSuccess: async(data) => {
      return handleMutationSuccess(
        data, 'Игрок удален из друзей', data?.error || 'Попробуйте попытку позже', true
      );
    },
    onError: e => { throw new Error(e.message); },
  });
  
  return {
    rejectOutgoingRequestMutation,
    rejectIncomingRequestMutation,
    acceptIncomingRequestMutation,
    createRequestFriendMutation,
    removeFriendMutation,
  };
};