import { createClient } from "@repo/lib/utils/api/server.ts";
import { RealtimePostgresChangesPayload } from '@supabase/realtime-js';
import { Tables } from '@repo/types/entities/supabase.ts';
import { invalidateAllFriendsRequests } from '../../../helpers/invalidate-friends-requests.ts';
import { notifyClientAboutAccept, notifyClientAboutRequest } from '../../../helpers/notify-client.tsx';

type FriendsRequestsTable = Tables<'friends_requests'>
type UserFriendsTable = Tables<'users_friends'>

type FriendSubType<T extends { [key: string]: any }> = RealtimePostgresChangesPayload<T>

export const friendsSubscribeEvents = (currentUserNickname: string) => {
  const supabase = createClient();

  const handleNotifyAboutFriendAccepted = (pd: FriendSubType<UserFriendsTable>) => {
    if (pd.eventType === 'INSERT') {
      return notifyClientAboutRequest(pd)
    }
  };
  
  const handleNotifyAboutFriendRequest = (pd: FriendSubType<FriendsRequestsTable>) => {
    if (pd.eventType === 'INSERT') {
      return notifyClientAboutAccept(pd)
    }
  };
  
  const handleNotifyAboutFriendDeleted = (pd: FriendSubType<UserFriendsTable>) => {
    if (pd.eventType === 'DELETE') {
      return invalidateAllFriendsRequests(pd);
    }
  };
  
  supabase.channel('users_friends')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'users_friends',
    filter: `user_1=eq.${currentUserNickname}`,
  }, handleNotifyAboutFriendAccepted)
  .subscribe();
  
  supabase.channel('friends_requests')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'friends_requests',
    filter: `recipient=eq.${currentUserNickname}`,
  }, handleNotifyAboutFriendRequest)
  .subscribe();
  
  supabase.channel('users_friends')
  .on('postgres_changes', {
    event: 'DELETE',
    schema: 'public',
    table: 'users_friends',
    filter: `user_1=eq.${currentUserNickname}`,
  }, handleNotifyAboutFriendDeleted)
  .subscribe();
};