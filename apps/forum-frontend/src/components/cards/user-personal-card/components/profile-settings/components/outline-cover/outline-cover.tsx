import { currentUserQuery } from '@repo/lib/queries/current-user-query.ts';
import { useUpdateUserSettings } from '@repo/lib/hooks/use-update-user-settings.ts';
import { Switch } from '@repo/ui/src/components/switch';

{/* <div className="flex flex-col gap-y-2 w-full p-2">
<Typography textSize="small" textColor="shark_white">
  Обводка вокруг профиля - уникальная фича, чтобы выделиться
  среди других игроков.
</Typography>
<Typography textSize="small" textColor="shark_white">
  Цвет обводки зависит от типа привилегии.
</Typography>
</div> */}

export const OutlineCover = () => {
  const { preferences: { cover_outline_visible } } = currentUserQuery().data;
  const { updateUserSettingsMutation } = useUpdateUserSettings()

  const handleCoverOutlineVisibility = (value: boolean) => {
    if (value === cover_outline_visible) return;

    return updateUserSettingsMutation.mutate({
      setting: "cover_outline_visible", value
    })
  }

  return (
    <Switch
      checked={cover_outline_visible}
      defaultChecked={cover_outline_visible}
      onCheckedChange={v => handleCoverOutlineVisibility(v)}
    />
  );
};