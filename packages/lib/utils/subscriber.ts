'use server';

import { createClient } from '#utils/api/server.ts';
import { FriendRequestEntity } from '@repo/types/entities/entities-type.ts';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { getCurrentUser } from '#actions/get-current-user.ts';
import { QueryClient } from '@tanstack/react-query';
import { REJECTED_QUERY_KEY } from '#hooks/rejected-query.ts';

type SubscribeDetails = {
  initiator: string,
  recipient: string,
}

export async function subscriber() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;
  
  const qc = new QueryClient();
  const api = createClient();
  
  api
  .channel('custom-all-channel')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'friends_requests' },
    (payload: RealtimePostgresChangesPayload<FriendRequestEntity>) => {
      if (payload.eventType === 'DELETE') {
        if (payload.old.initiator === currentUser.nickname) {
          qc.setQueryData(REJECTED_QUERY_KEY, () => {
            return { initiator: payload.old.initiator }
          })
          
          console.log(payload.old.recipient);
        }
      }
    },
  ).subscribe();
}