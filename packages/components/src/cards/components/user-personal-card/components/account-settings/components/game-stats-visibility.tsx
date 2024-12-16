import { DropdownWrapper } from "#wrappers/dropdown-wrapper.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { HoverCardItem } from "@repo/ui/src/components/hover-card.tsx";
import { useUpdateUserSettings } from '@repo/lib/hooks/use-update-user-settings.ts';
import { currentUserQuery } from '@repo/lib/queries/current-user-query.ts';

const GAME_STATS_VISIBLITY_OPTIONS = [
  { name: "включить", value: true },
  { name: "выключить", value: false },
];

export const GameStatsVisibility = () => {
  const { preferences: { game_stats_visible } } = currentUserQuery().data;
  const { updateUserSettingsMutation } = useUpdateUserSettings();
  
  const handleGameStatsVisibility = (value: boolean) => {
    if (value === game_stats_visible) return;
    
    return updateUserSettingsMutation.mutate({
      setting: 'game_stats_visible', value
    });
  };
  
  return (
    <DropdownWrapper
      properties={{ contentAlign: "end", sideAlign: "right" }}
      trigger={
        <Typography className="text-base">
          {game_stats_visible ? "видна" : "скрыта"}
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
            {GAME_STATS_VISIBLITY_OPTIONS.map(({ value, name }) => (
              <HoverCardItem
                key={value.toString()}
                isActive={game_stats_visible === value}
                onClick={() => handleGameStatsVisibility(value)}
              >
                <Typography>{name}</Typography>
              </HoverCardItem>
            ))}
          </div>
        </div>
      }
    />
  );
};