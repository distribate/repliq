import React from 'react';
import { DropdownWrapper } from '../../../../../../wrappers/dropdown-wrapper.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { useQueryClient } from '@tanstack/react-query';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { useUpdateCurrentUser } from '@repo/lib/hooks/use-update-current-user.ts';
import { getPreferenceValue } from '@repo/lib/helpers/convert-user-preferences-to-map.ts';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';

export const RealNameVisibility = () => {
  const qc = useQueryClient()
  const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY)
  const { updateFieldMutation } = useUpdateCurrentUser();
  
  if (!currentUser) return;
  
  const preferences = currentUser.preferences;
  const preferRealName = getPreferenceValue(preferences, "realNameVisibility")
  
  const handleRealNamePrefer = (
    e: React.MouseEvent<HTMLDivElement>, value: boolean,
  ) => {
    e.preventDefault();
    
    updateFieldMutation.mutate({
      value: value.toString(),
      field: 'preferences',
      preferences: {
        value: value, key: 'realNameVisibility',
      },
    });
  };
  
  return (
    <DropdownWrapper
      trigger={
        <Typography className="text-base">
          {preferRealName ? 'видно' : 'скрыто'}
        </Typography>
      }
      content={
        <div className="flex flex-col gap-y-4">
          <div className="flex justify-start w-full flex-col pt-2 px-2">
            <Typography className="text-shark-300 text-sm">
              Реальное имя
            </Typography>
          </div>
          <div className="flex flex-col gap-y-2">
            <HoverCardItem onClick={(e) => handleRealNamePrefer(e, true)}>
              <Typography className={preferRealName ? 'text-caribbean-green-500' : ''}>
                включить
              </Typography>
            </HoverCardItem>
            <HoverCardItem onClick={(e) => handleRealNamePrefer(e, false)}>
              <Typography className={!preferRealName ? 'text-caribbean-green-500' : ''}>
                выключить
              </Typography>
            </HoverCardItem>
          </div>
        </div>
      }
    />
  );
};