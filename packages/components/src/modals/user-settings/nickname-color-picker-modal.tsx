import { Typography } from "@repo/ui/src/components/typography.tsx";
import { NicknameColorPicker } from "#cards/components/user-personal-card/components/profile-settings/components/nickname-color-picker.tsx";
import { DynamicModal } from "../dynamic-modal.tsx";
import { UPDATE_FIELD_MUTATION_KEY } from "@repo/lib/hooks/use-update-current-user.ts";
import BlueDye from "@repo/assets/images/minecraft/blue_dye.webp";
import { UserSettingOption } from "#cards/components/user-personal-card/components/profile-settings/user-profile-settings.tsx";
import { currentUserQuery } from '@repo/lib/queries/current-user-query.ts';

export const NicknameColorPickerModal = () => {
  const { data: { nickname, name_color } } = currentUserQuery();

  return (
    <DynamicModal
      mutationKey={UPDATE_FIELD_MUTATION_KEY}
      contentClassName="min-w-[650px]"
      trigger={
        <UserSettingOption title="Цвет никнейма" imageSrc={BlueDye.src}>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4" style={{ backgroundColor: name_color }} />
            <Typography className="text-base">
              {name_color.toString()}
            </Typography>
          </div>
        </UserSettingOption>
      }
      content={
        <NicknameColorPicker nickname={nickname} name_color={name_color} />
      }
    />
  );
};