'use client';

import { toast } from '@repo/ui/src/hooks/use-toast.ts';
import {
  FriendRequestResponseAccept,
  FriendRequestResponseDefault,
} from '@repo/components/src/templates/friend-request-response.tsx';
import { invalidateAllFriendsRequests } from './invalidate-friends-requests.ts';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export const notifyClientAboutRequest = (pd: any) => {
  toast({
    title: `Новое уведомление`,
    description: <FriendRequestResponseDefault payload={pd} />,
  });
  
  return invalidateAllFriendsRequests(pd);
};

export const notifyClientAboutAccept = (pd: any) => {
  toast({
    title: `Новое уведомление.`,
    description: <FriendRequestResponseAccept payload={pd} />,
  });
  
  return invalidateAllFriendsRequests(pd);
};