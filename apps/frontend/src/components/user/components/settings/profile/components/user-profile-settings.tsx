import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { DescriptionInput } from "./description-input.tsx";
import { OutlineCover } from "./outline-cover.tsx";
import { ProfileVisibilityChange } from "./profile-visibility-change.tsx";
import { UserSettingOption } from "#ui/user-setting-option.tsx";
import { UserSettingsBack } from "#components/modals/user-settings/components/user-settings-back.tsx";
import { reatomComponent } from "@reatom/npm-react";
import {
  navigateToDialogAction,
  ProfileDialog,
  settingsCurrentDialogAtom
} from "#components/modals/user-settings/models/user-settings.model.ts";
import dayjs from "@repo/shared/constants/dayjs-instance";
import { RealNameChange } from "./real-name-change.tsx";
import { ReactNode } from "react";
import { parseDateOrTimestamp } from "#components/user/components/settings/profile/components/birthday-picker/helpers/birthday-picker.ts";
import { IconBorderCorners, IconGiftFilled, IconKeyframeFilled, IconLabel, IconUserSquare } from "@tabler/icons-react";
import { getUser } from "#components/user/models/current-user.model.ts";
import { DateBirthdayPicker } from "./birthday-picker/components/date-birthday-picker.tsx";
import { NicknameColorPicker as ColorPicker } from "./nickname-color-picker.tsx";

type HexToRgbaProps = {
  hex: string
  alpha: number
}

const hexToRgba = ({ hex, alpha }: HexToRgbaProps) => {
  const match = hex.match(/\w\w/g)!;
  const [r, g, b] = match.map((x) => parseInt(x, 16));

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const NicknameColorPicker = reatomComponent(({ ctx }) => {
  const { nickname, name_color } = getUser(ctx)

  return (
    <ColorPicker
      nickname={nickname}
      name_color={name_color}
    />
  );
}, "NicknameColorPicker")

const ProfileVisibilityOption = reatomComponent(({ ctx }) => {
  const visibility = getUser(ctx).preferences.profile_visibility

  return (
    <UserSettingOption
      onClick={() => navigateToDialogAction(ctx, "visibility")}
      title="Тип аккаунта:"
      icon={{ value: IconUserSquare }}
    >
      <Typography className="text-base">
        {visibility === "all" ? "открытый" : "закрытый"}
      </Typography>
    </UserSettingOption>
  )
}, "ProfileVisibilityOption")

const BirthdayOption = reatomComponent(({ ctx }) => {
  const birthday = getUser(ctx).birthday;

  return (
    <UserSettingOption
      title="День рождения"
      icon={{ value: IconGiftFilled }}
      onClick={() => navigateToDialogAction(ctx, "birthday")}
    >
      <div className="flex items-center gap-1">
        <Typography className="text-base">
          {birthday ? dayjs(birthday).format("DD MMM YYYY") : `не указано`}
        </Typography>
      </div>
    </UserSettingOption>
  )
}, "BirthdayOption")

const RealnameOption = reatomComponent(({ ctx }) => {
  const realName = getUser(ctx).real_name ?? 'нет';

  return (
    <UserSettingOption
      title="Реальное имя"
      icon={{ value: IconLabel }}
      onClick={() => navigateToDialogAction(ctx, "real-name")}
    >
      <div className="flex items-center gap-1">
        <Typography className="text-base">
          {realName}
        </Typography>
      </div>
    </UserSettingOption>
  )
}, "RealnameOption")

const NamecolorOption = reatomComponent(({ ctx }) => {
  const nameColor = getUser(ctx).name_color

  return (
    <UserSettingOption
      title="Цвет никнейма"
      icon={{ value: IconKeyframeFilled }}
      onClick={() => navigateToDialogAction(ctx, "name-color")}
    >
      <div
        className={`flex items-center px-4 py-1 backdrop-blur-md rounded-md`}
        style={{
          backgroundColor: hexToRgba({ hex: nameColor, alpha: 0.3 }),
        }}
      >
        <Typography className="text-base font-semibold" style={{ color: nameColor }}>
          {nameColor.toString()}
        </Typography>
      </div>
    </UserSettingOption>
  )
}, "NamecolorOption")

const DateBirthday = reatomComponent(({ ctx }) => {
  const birthday = getUser(ctx).birthday;
  const initDate = parseDateOrTimestamp(birthday ?? null) as string | null;

  return (
    <DateBirthdayPicker init={initDate ?? null} />
  )
}, "DateBirthday")

const PROFILE_SETTINGS_SECTION: Record<ProfileDialog, ReactNode> = {
  birthday: <DateBirthday />,
  "real-name": <RealNameChange />,
  "name-color": <NicknameColorPicker />,
  visibility: <ProfileVisibilityChange />,
}

export const UserProfileSettings = reatomComponent(({ ctx }) => {
  const is_donate = getUser(ctx).is_donate;
  const isAccess = is_donate === true;
  const current = ctx.spy(settingsCurrentDialogAtom)

  return (
    <div className="flex flex-col gap-y-4 items-center w-full">
      <UserSettingsBack />
      {current && PROFILE_SETTINGS_SECTION[current as ProfileDialog]}
      {!current && (
        <>
          <Typography variant="dialogTitle">Профиль</Typography>
          <div className="flex flex-col w-full gap-y-4">
            <DescriptionInput />
            <div className="flex flex-col bg-secondary-color w-full py-2 px-4">
              <Typography className="text-base text-shark-200">
                Расскажи о своем возрасте или чем занимаешься?
              </Typography>
              <Typography className="text-base text-shark-200">
                Например: 20-ти летний майнкрафтер из Москвы
              </Typography>
            </div>
          </div>
          <Separator />
          <div className="flex flex-col w-full gap-y-4">
            <ProfileVisibilityOption />
          </div>
          <Separator />
          <div className="flex flex-col w-full gap-y-4">
            <BirthdayOption />
            <RealnameOption />
            {isAccess && (
              <>
                <Separator className="relative bg-blue-500 brightness-150 mb-2">
                  <Typography className="absolute z-2 -top-0 left-0 text-blue-500 text-sm">
                    only Repliq+
                  </Typography>
                </Separator>
                <NamecolorOption />
                <UserSettingOption
                  title="Обводка вокруг шапки профиля"
                  icon={{ value: IconBorderCorners }}
                >
                  <OutlineCover />
                </UserSettingOption>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}, "UserProfileSettings")