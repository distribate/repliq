import { Typography } from "@repo/ui/src/components/typography.tsx";
import { DynamicModal } from "../../dynamic-modal/components/dynamic-modal.tsx";
import { UPDATE_FIELD_MUTATION_KEY } from "@repo/lib/hooks/use-update-current-user.ts";
import BlueDye from "@repo/assets/images/minecraft/blue_dye.webp";
import { currentUserQuery } from '@repo/lib/queries/current-user-query.ts';
import { hexToRgba } from "@repo/lib/helpers/hex-to-rgba.ts";
import { UserSettingOption } from "#components/cards/user-setting-option-card/components/user-setting-option.tsx";
import { lazy, Suspense } from "react";

const NicknameColorPicker = lazy(() =>
  import("#components/cards/user-personal-card/components/profile-settings/components/nickname-color/components/nickname-color-picker/nickname-color-picker.tsx")
    .then(m => ({ default: m.NicknameColorPicker }))
)

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
        <Suspense>
          <NicknameColorPicker nickname={nickname} name_color={name_color} />
        </Suspense>
      }
    />
  );
};