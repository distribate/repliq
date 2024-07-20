'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteRequest, RequestProperties } from '../queries/reject-request.ts';
import { toast } from '@repo/ui/src/hooks/use-toast.ts';
import {
  REQUESTS_INCOMING_QUERY_KEY,
} from '../../../../profile/components/friends/queries/requests-incoming-query.ts';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import {
  REQUESTS_OUTGOING_QUERY_KEY,
} from '../../../../profile/components/friends/queries/requests-outgoing-query.ts';
import { acceptRequest } from '../queries/accept-request.ts';
import { FRIENDS_QUERY_KEY } from '../../../../profile/components/friends/queries/friends-query.ts';
import { REQUESTS_QUERY_KEY } from '../../../../profile/components/friends/queries/requests-query.ts';

export const useControlRequests = () => {
  const qc = useQueryClient();
  const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY);
  
  const acceptIncomingRequestMutation = useMutation({
    mutationFn: async({
      recipient, initiator,
    }: RequestProperties) => {
      const { added } = await acceptRequest({
        initiator, recipient,
      });
      
      if (added.status === 200) toast({ title: 'Заявка принята.' });
    },
    onSuccess: async() => {
      if (currentUser) {
        await Promise.all([
          qc.invalidateQueries({ queryKey: REQUESTS_INCOMING_QUERY_KEY(currentUser.nickname) }),
          qc.invalidateQueries({ queryKey: REQUESTS_QUERY_KEY(currentUser.nickname) }),
          qc.invalidateQueries({ queryKey: FRIENDS_QUERY_KEY(currentUser.nickname) }),
          qc.invalidateQueries({ queryKey: REQUESTS_OUTGOING_QUERY_KEY(currentUser.nickname) }),
        ]);
      }
    },
  });
  
  const rejectIncomingRequestMutation = useMutation({
    mutationFn: async({ recipient, initiator }: RequestProperties) => {
      const { status, error } = await deleteRequest({
        initiator, recipient,
      });
      
      if (status === 201 || status === 200) {
        toast({ title: 'Запрос отменен', variant: 'positive' });
      }
    },
    onSuccess: async(data) => {
      if (currentUser) {
        await Promise.all([
          qc.invalidateQueries({ queryKey: REQUESTS_QUERY_KEY(currentUser.nickname) }),
          qc.invalidateQueries({ queryKey: REQUESTS_INCOMING_QUERY_KEY(currentUser.nickname) }),
          qc.invalidateQueries({ queryKey: FRIENDS_QUERY_KEY(currentUser.nickname) }),
          qc.invalidateQueries({ queryKey: REQUESTS_OUTGOING_QUERY_KEY(currentUser.nickname) }),
        ]);
      }
    },
  });
  
  return { rejectIncomingRequestMutation, acceptIncomingRequestMutation };
};