"use client"

import { useQueryClient } from '@tanstack/react-query';
import {
  REQUESTED_USER_QUERY_KEY
} from '@repo/components/src/profile/components/cover/cover/queries/requested-user-query.ts';
import { REQUESTS_INCOMING_QUERY_KEY } from '@repo/components/src/friends/queries/requests-incoming-query.ts';
import { REQUESTS_QUERY_KEY } from '@repo/components/src/friends/queries/requests-query.ts';
import { REQUESTS_OUTGOING_QUERY_KEY } from '@repo/components/src/friends/queries/requests-outgoing-query.ts';
import { FRIENDS_QUERY_KEY } from '@repo/components/src/friends/queries/friends-query.ts';

export async function invalidateAllFriendsRequests(payload: any) {
  const qc = useQueryClient();
  
  await Promise.all([
    qc.invalidateQueries({
      queryKey: REQUESTED_USER_QUERY_KEY(payload.new.user_1),
    }),
    qc.invalidateQueries({
      queryKey: REQUESTED_USER_QUERY_KEY(payload.new.user_2),
    }),
    qc.invalidateQueries({
      queryKey: REQUESTS_INCOMING_QUERY_KEY(payload.new.user_1),
    }),
    qc.invalidateQueries({
      queryKey: REQUESTS_INCOMING_QUERY_KEY(payload.new.user_2),
    }),
    qc.invalidateQueries({
      queryKey: REQUESTS_QUERY_KEY(payload.new.user_1),
    }),
    qc.invalidateQueries({
      queryKey: REQUESTS_QUERY_KEY(payload.new.user_2),
    }),
    qc.invalidateQueries({
      queryKey: REQUESTS_OUTGOING_QUERY_KEY(payload.new.user_1),
    }),
    qc.invalidateQueries({
      queryKey: REQUESTS_OUTGOING_QUERY_KEY(payload.new.user_2),
    }),
    qc.invalidateQueries({
      queryKey: FRIENDS_QUERY_KEY(payload.new.user_1),
    }),
    qc.invalidateQueries({
      queryKey: FRIENDS_QUERY_KEY(payload.new.user_2),
    })
  ])
}