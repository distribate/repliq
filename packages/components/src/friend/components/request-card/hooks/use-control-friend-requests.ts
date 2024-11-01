'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteFriendRequest } from '../queries/delete-friend-request.ts';
import { toast } from 'sonner';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { acceptFriendRequest } from '../queries/accept-friend-request.ts';
import { SEARCHING_FRIENDS_QUERY_KEY } from '../../../../friends/queries/searching-friends-query.ts';
import {
  REQUESTS_INCOMING_QUERY_KEY,
  requestsIncomingQuery,
} from '../../../../friends/queries/requests-incoming-query.ts';
import {
  REQUESTS_OUTGOING_QUERY_KEY,
  requestsOutgoingQuery,
} from '../../../../friends/queries/requests-outgoing-query.ts';
import { REQUESTS_QUERY_KEY } from '../../../../friends/queries/requests-query.ts';
import { FRIENDS_QUERY_KEY } from '../../../../friends/queries/friends-query.ts';

export type FriendRequestType = 'incoming' | 'outgoing'

type RejectRequestProperties = {
  initiator: string,
  type: FriendRequestType
}

export const useControlFriendRequests = () => {
  const qc = useQueryClient();
  const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY);
  
  const { data: incomingRequests } = requestsIncomingQuery();
  const { data: outgoingRequests } = requestsOutgoingQuery();
  
  const invalidateRequests = async() => {
    if (currentUser) {
      await Promise.all([
        qc.invalidateQueries({ queryKey: REQUESTS_INCOMING_QUERY_KEY(currentUser.nickname) }),
        qc.invalidateQueries({ queryKey: REQUESTS_QUERY_KEY(currentUser.nickname) }),
        qc.invalidateQueries({ queryKey: FRIENDS_QUERY_KEY(currentUser.nickname) }),
        qc.invalidateQueries({ queryKey: SEARCHING_FRIENDS_QUERY_KEY(currentUser?.nickname) }),
        qc.invalidateQueries({ queryKey: REQUESTS_OUTGOING_QUERY_KEY(currentUser.nickname) }),
      ]);
    }
  };
  
  const acceptIncomingRequestMutation = useMutation({
    mutationFn: async(initiator: string) => {
      let friend_id: string | null = null;
      
      if (!incomingRequests) return;
      
      const incomingRequest = incomingRequests.find(
        fd => fd.recipient === currentUser?.nickname
          && fd.initiator === initiator,
      );
      
      if (!incomingRequest) return;
      
      friend_id = incomingRequest.id;
      
      const acceptRequest = await acceptFriendRequest({
        initiator, friend_id,
      });
      
      if (acceptRequest
        && (acceptRequest.status === 200 || acceptRequest.status === 201)
      ) {
        return toast.success('Заявка принята.');
      } else {
        return toast.error('Произошла ошибка. Попробуйте позже', {
          description: 'Попробуйте попытку позже'
        });
      }
    },
    onSuccess: async() => await invalidateRequests(),
    onError: (e) => { throw new Error(e.message); },
  });
  
  const rejectIncomingRequestMutation = useMutation({
    mutationFn: async({
      type, initiator,
    }: RejectRequestProperties) => {
      let friend_id: string | null = null;
      
      if (!type) return;
      
      if (type === 'incoming') {
        if (!incomingRequests) return;
        
        const incomingRequest = incomingRequests.find(
          fd => fd.recipient === currentUser?.nickname
            && fd.initiator === initiator,
        );
        
        if (!incomingRequest) return;
        
        friend_id = incomingRequest.id;
      }
      
      if (type === 'outgoing') {
        if (!outgoingRequests) return;
        
        const outgoingRequest = outgoingRequests.find(
          fd => fd.initiator === currentUser?.nickname
            && fd.recipient === initiator,
        );
        
        if (!outgoingRequest) return;
        
        friend_id = outgoingRequest.id;
      }
      
      if (!friend_id) return;
      
      const { status } = await deleteFriendRequest(friend_id);
      
      if (status === 204 || status === 200) {
        return toast.info('Запрос отменен');
      } else {
        return toast.error('Произошла ошибка. Попробуйте позже', {
          description: 'Попробуйте попытку позже'
        });
      }
    },
    onSuccess: async() => await invalidateRequests(),
    onError: (e) => { throw new Error(e.message); },
  });
  
  return { rejectIncomingRequestMutation, acceptIncomingRequestMutation };
};