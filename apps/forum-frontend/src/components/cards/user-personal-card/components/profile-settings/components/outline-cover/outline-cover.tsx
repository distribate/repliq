import { Switch } from '@repo/ui/src/components/switch';
import { reatomComponent } from '@reatom/npm-react';
import { getUser } from '@repo/lib/helpers/get-user';
import { updateCurrentUserSettingsAction } from '../../models/update-current-user.model';
import { spawn } from '@reatom/framework';

{/* <div className="flex flex-col gap-y-2 w-full p-2">
<Typography textSize="small" textColor="shark_white">
  Обводка вокруг профиля - уникальная фича, чтобы выделиться
  среди других игроков.
</Typography>
<Typography textSize="small" textColor="shark_white">
  Цвет обводки зависит от типа привилегии.
</Typography>
</div> */}

export const OutlineCover = reatomComponent(({ ctx }) => {
  const cover_outline_visible= getUser(ctx).preferences.cover_outline_visible

  const handleCoverOutlineVisibility = (value: boolean) => {
    if (value === cover_outline_visible) return;

    void spawn(ctx, async (spawnCtx) => updateCurrentUserSettingsAction(spawnCtx, {
      setting: "cover_outline_visible", value
    }))
  }

  return (
    <Switch
      checked={cover_outline_visible}
      defaultChecked={cover_outline_visible}
      onCheckedChange={v => handleCoverOutlineVisibility(v)}
    />
  );
}, "OutlineCover")