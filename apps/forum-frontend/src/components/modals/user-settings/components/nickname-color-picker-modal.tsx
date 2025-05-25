import { Typography } from "@repo/ui/src/components/typography.tsx";
import { DynamicModal } from "../../dynamic-modal/components/dynamic-modal.tsx";
import BlueDye from "@repo/assets/images/minecraft/blue_dye.webp";
import { hexToRgba } from "@repo/lib/helpers/hex-to-rgba.ts";
import { UserSettingOption } from "#components/cards/user-setting-option-card/components/user-setting-option.tsx";
import { lazy, Suspense } from "react";
import { reatomComponent } from "@reatom/npm-react";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { updateCurrentUserAction } from "#components/cards/user-personal-card/components/profile-settings/models/update-current-user.model.ts";

const NicknameColorPicker = lazy(() =>
  import("#components/cards/user-personal-card/components/profile-settings/components/nickname-color/components/nickname-color-picker/nickname-color-picker.tsx")
    .then(m => ({ default: m.NicknameColorPicker }))
)

export const NicknameColorPickerModal = reatomComponent(({ ctx }) => {
  const { nickname, name_color } = getUser(ctx)

  return (
    <DynamicModal
      autoClose
      withLoader
      isPending={ctx.spy(updateCurrentUserAction.statusesAtom).isPending}
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
}, "NicknameColorPickerModal")