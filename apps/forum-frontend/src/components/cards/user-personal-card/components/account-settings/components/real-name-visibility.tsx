import { useUpdateUserSettings } from '@repo/lib/hooks/use-update-user-settings.ts';
import { currentUserQuery } from '@repo/lib/queries/current-user-query.ts';
import { Switch } from '@repo/ui/src/components/switch';

export const RealNameVisibility = () => {
  const { preferences: { real_name_visible } } = currentUserQuery().data;
  const { updateUserSettingsMutation } = useUpdateUserSettings();

  const handleRealNameVisibility = (value: boolean) => {
    if (value === real_name_visible) return;

    return updateUserSettingsMutation.mutate({
      setting: 'real_name_visible', value,
    });
  };

  return (
    <Switch
      checked={real_name_visible}
      defaultChecked={real_name_visible}
      onCheckedChange={v => handleRealNameVisibility(v)}
    />
  );
};
