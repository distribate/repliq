import { useUpdateUserSettings } from '@repo/lib/hooks/use-update-user-settings.ts';
import { currentUserQuery } from '@repo/lib/queries/current-user-query.ts';
import { Switch } from "@repo/ui/src/components/switch";

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
    <Switch
      checked={game_stats_visible}
      defaultChecked={game_stats_visible}
      onCheckedChange={v => handleGameStatsVisibility(v)}
    />
  )
}