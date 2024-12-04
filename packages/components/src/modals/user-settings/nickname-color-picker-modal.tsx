import { Typography } from "@repo/ui/src/components/typography.tsx";
import { NicknameColorPicker } from "#cards/components/user-personal-card/components/profile-settings/components/nickname-color-picker.tsx";
import { DynamicModal } from "../dynamic-modal.tsx";
import { UPDATE_FIELD_MUTATION_KEY } from "@repo/lib/hooks/use-update-current-user.ts";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import BlueDye from "@repo/assets/images/minecraft/blue_dye.webp";
import { UserSettingOption } from "#cards/components/user-personal-card/components/profile-settings/user-profile-settings.tsx";

export const NicknameColorPickerModal = () => {
  const currentUser = getUser();
  const nameColor = currentUser.name_color;

  return (
    <DynamicModal
      mutationKey={UPDATE_FIELD_MUTATION_KEY}
      contentClassName="min-w-[650px]"
      trigger={
        <UserSettingOption title="Цвет никнейма" imageSrc={BlueDye.src}>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4" style={{ backgroundColor: nameColor }} />
            <Typography className="text-base">
              {nameColor.toString()}
            </Typography>
          </div>
        </UserSettingOption>
      }
      content={
        <NicknameColorPicker
          nickname={currentUser.nickname}
          name_color={nameColor}
        />
      }
    />
  );
};
