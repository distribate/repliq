import { Typography } from '@repo/ui/src/components/typography.tsx';
import {
  RealNameChange,
} from '#components/cards/user-personal-card/components/profile-settings/components/real-name-change/components/real-name-change.tsx';
import { DynamicModal } from '../../dynamic-modal/components/dynamic-modal.tsx';
import Nametag from '@repo/assets/images/minecraft/nametag.webp';
import { UserSettingOption } from '#components/cards/user-setting-option-card/components/user-setting-option.tsx';
import { currentUserAtom } from '@repo/lib/helpers/get-user.ts';
import { reatomComponent } from '@reatom/npm-react';
import { updateCurrentUserAction } from '#components/cards/user-personal-card/components/profile-settings/models/update-current-user.model.ts';

export const RealNameChangeModal = reatomComponent(({ ctx }) => {
  return (
    <DynamicModal
      withLoader
      autoClose
      isPending={ctx.spy(updateCurrentUserAction.statusesAtom).isPending}
      trigger={
        <UserSettingOption title="Реальное имя" imageSrc={Nametag}>
          <div className="flex items-center gap-1">
            <Typography className="text-base">
              {ctx.spy(currentUserAtom)?.real_name ?? 'нет'}
            </Typography>
          </div>
        </UserSettingOption>
      }
      content={<RealNameChange />}
    />
  );
}, "RealNameChangeModal")