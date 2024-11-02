import { useUpdateCurrentUser } from '@repo/lib/hooks/use-update-current-user.ts';
import { getPreferenceValue } from '@repo/lib/helpers/convert-user-preferences-to-map.ts';
import React from 'react';
import { DropdownWrapper } from '#wrappers/dropdown-wrapper.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { getUser } from '@repo/lib/helpers/get-user.ts';

export const FriendRequest = () => {
  const currentUser = getUser();
  const { updateFieldMutation } = useUpdateCurrentUser();
  
  if (!currentUser) return;
  
  const preferences = currentUser.properties.preferences;
  const preferFriendRequest = getPreferenceValue(preferences, "friendRequest")
  
  const handleFriendRequestPrefer = (
    e: React.MouseEvent<HTMLDivElement>, value: boolean,
  ) => {
    e.preventDefault();
    
    updateFieldMutation.mutate({
      value: value.toString(),
      field: 'preferences',
      preferences: {
        value: value, key: 'friendRequest',
      },
    });
  };
  
  return (
    <DropdownWrapper
      properties={{ contentAlign: 'end', sideAlign: 'right', }}
      trigger={
        <Typography className="text-base">
          {preferFriendRequest ? 'вкл' : 'выкл'}
        </Typography>
      }
      content={
        <div className="flex flex-col gap-y-4">
          <div className="flex justify-start w-full flex-col pt-2 px-2">
            <Typography className="text-shark-300 text-sm">
              Заявки в друзья
            </Typography>
          </div>
          <div className="flex flex-col gap-y-2">
            <HoverCardItem onClick={(e) => handleFriendRequestPrefer(e, true)}>
              <Typography className={preferFriendRequest ? 'text-caribbean-green-500' : ''}>
                включить
              </Typography>
            </HoverCardItem>
            <HoverCardItem onClick={(e) => handleFriendRequestPrefer(e, false)}>
              <Typography className={!preferFriendRequest ? 'text-caribbean-green-500' : ''}>
                выключить
              </Typography>
            </HoverCardItem>
          </div>
        </div>
      }
    />
  );
}