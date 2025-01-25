import { Typography } from '@repo/ui/src/components/typography.tsx';
import {
  RealNameChange,
} from '#cards/components/user-personal-card/components/profile-settings/components/real-name-change/components/real-name-change.tsx';
import { DynamicModal } from '../dynamic-modal.tsx';
import { UPDATE_FIELD_MUTATION_KEY } from '@repo/lib/hooks/use-update-current-user.ts';
import {
  UserSettingOption,
} from '#cards/components/user-personal-card/components/profile-settings/user-profile-settings.tsx';
import Nametag from '@repo/assets/images/minecraft/nametag.webp';
import { currentUserQuery } from '@repo/lib/queries/current-user-query.ts';

export const RealNameChangeModal = () => {
  const { data } = currentUserQuery();
  const { real_name } = data;
  
  return (
    <DynamicModal
      mutationKey={UPDATE_FIELD_MUTATION_KEY}
      trigger={
        <UserSettingOption title="Реальное имя" imageSrc={Nametag}>
          <div className="flex items-center gap-1">
            <Typography className="text-base">
              {real_name ?? 'не указано'}
            </Typography>
          </div>
        </UserSettingOption>
      }
      content={<RealNameChange />}
    />
  );
};