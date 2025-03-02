import { Typography } from "@repo/ui/src/components/typography.tsx";
import { NicknameColorPicker } from "#components/cards/user-personal-card/components/profile-settings/components/nickname-color/nickname-color-picker.tsx";
import { DynamicModal } from "../dynamic-modal.tsx";
import { UPDATE_FIELD_MUTATION_KEY } from "@repo/lib/hooks/use-update-current-user.ts";
import BlueDye from "@repo/assets/images/minecraft/blue_dye.webp";
import { UserSettingOption } from "#components/cards/user-personal-card/components/profile-settings/user-profile-settings.tsx";
import { currentUserQuery } from '@repo/lib/queries/current-user-query.ts';
import { hexToRgba } from "@repo/lib/helpers/hex-to-rgba.ts";

export const NicknameColorPickerModal = () => {
  const { data: { nickname, name_color } } = currentUserQuery();

  return (
    <DynamicModal
      mutationKey={UPDATE_FIELD_MUTATION_KEY}
      contentClassName="min-w-[650px]"
      trigger={
        <UserSettingOption title="Цвет никнейма" imageSrc={BlueDye}>
          <div
            className={`flex items-center px-4 py-1 backdrop-blur-md rounded-md`}
            style={{
              backgroundColor: hexToRgba({ hex: name_color, alpha: 0.3 }),
            }}
          >
            <Typography className="text-base font-semibold" style={{ color: name_color }}>
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