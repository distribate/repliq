import { useQueryClient } from '@tanstack/react-query';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { useUpdateCurrentUser } from '@repo/lib/hooks/use-update-current-user.ts';
import { getPreferenceValue } from '@repo/lib/helpers/convert-user-preferences-to-map.ts';
import React, { useCallback } from 'react';
import { DropdownWrapper } from '../../../../../../wrappers/dropdown-wrapper.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';

type GameStatsVisibilityProps = {
  e: React.MouseEvent<HTMLDivElement>,
  value: boolean
}

const GAME_STATS_VISIBLITY_OPTIONS = [
  { name: 'включить', value: true, },
  { name: 'выключить', value: false, },
];

const GAME_STATS_VISIBLITY_NAME = "gameStatsVisibility"

export const GameStatsVisibility = () => {
  const qc = useQueryClient();
  const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY);
  const { updateFieldMutation } = useUpdateCurrentUser();
  
  if (!currentUser) return;
  
  const preferences = currentUser.properties.preferences;
  const preferGameStats = getPreferenceValue(
    preferences, GAME_STATS_VISIBLITY_NAME
  );
  
  const handleGameStatsPrefer = useCallback((values: GameStatsVisibilityProps) => {
    const { e, value } = values;
    
    e.preventDefault();
    
    updateFieldMutation.mutate({
      value: value.toString(),
      field: 'preferences',
      preferences: {
        value: value, key: GAME_STATS_VISIBLITY_NAME,
      },
    });
  }, [ updateFieldMutation ])
  
  return (
    <DropdownWrapper
      properties={{ contentAlign: 'end', sideAlign: 'right', }}
      trigger={
        <Typography className="text-base">
          {preferGameStats ? 'видна' : 'скрыта'}
        </Typography>
      }
      content={
        <div className="flex flex-col gap-y-4">
          <div className="flex justify-start w-full flex-col pt-2 px-2">
            <Typography className="text-shark-300 text-sm">
              Игровая статистика
            </Typography>
          </div>
          <div className="flex flex-col gap-y-2">
            {GAME_STATS_VISIBLITY_OPTIONS.map(option => (
              <HoverCardItem
                key={option.value.toString()}
                isActive={preferGameStats === option.value}
                onClick={(e) => handleGameStatsPrefer({ e, value: option.value })}
              >
                <Typography>{option.name}</Typography>
              </HoverCardItem>
            ))}
          </div>
        </div>
      }
    />
  );
};