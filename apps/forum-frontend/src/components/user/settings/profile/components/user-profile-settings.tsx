import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { DescriptionInput } from "./description-input.tsx";
import { OutlineCover } from "./outline-cover.tsx";
import { ProfileVisibilityChange } from "./profile-visibility-change.tsx";
import { UserSettingOption } from "#components/user/settings/user-setting-option.tsx";
import { UserSettingsBack } from "#components/modals/user-settings/components/user-settings-back.tsx";
import { reatomComponent } from "@reatom/npm-react";
import {
  navigateToDialogAction,
  ProfileDialog,
  settingsCurrentDialogAtom
} from "#components/modals/user-settings/models/user-settings.model.ts";
import dayjs from "@repo/lib/constants/dayjs-instance";
import { RealNameChange } from "./real-name-change.tsx";
import { lazy, ReactNode, Suspense } from "react";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { parseDateOrTimestamp } from "#components/user/settings/profile/components/birthday-picker/helpers/birthday-picker";
import { IconBorderCorners, IconGiftFilled, IconKeyframeFilled, IconLabel, IconUserSquare } from "@tabler/icons-react";
import { getUser } from "#components/user/models/current-user.model.ts";

const ColorPicker = lazy(() =>
  import("#components/user/settings/profile/components/nickname-color-picker")
    .then(m => ({ default: m.NicknameColorPicker }))
)

type HexToRgbaProps = {
  hex: string
  alpha: number
}

const hexToRgba = ({ hex, alpha }: HexToRgbaProps) => {
  const match = hex.match(/\w\w/g)!;
  const [r, g, b] = match.map((x) => parseInt(x, 16));
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const DatePicker = lazy(() =>
  import("#components/user/settings/profile/components/birthday-picker/components/date-birthday-picker")
    .then(m => ({ default: m.DateBirthdayPicker })))

const NicknameColorPicker = reatomComponent(({ ctx }) => {
  const { nickname, name_color } = getUser(ctx)

  return (
    <Suspense fallback={<Skeleton className="h-24 w-full" />}>
      <ColorPicker nickname={nickname} name_color={name_color} />
    </Suspense>
  );
}, "NicknameColorPicker")

const ProfileVisibilityOption = reatomComponent(({ ctx }) => {
  const profile_visibility = getUser(ctx).preferences.profile_visibility

  return (
    <UserSettingOption
      onClick={() => navigateToDialogAction(ctx, "visibility")}
      title="Тип аккаунта:"
      icon={{ value: IconUserSquare }}
    >
      <Typography className="text-base">
        {profile_visibility === "all" ? "открытый" : "закрытый"}
      </Typography>
    </UserSettingOption>
  )
}, "ProfileVisibilityOption")

const BirthdayOption = reatomComponent(({ ctx }) => {
  const birthday = getUser(ctx).birthday;

  return (
    <UserSettingOption onClick={() => navigateToDialogAction(ctx, "birthday")} title="День рождения" icon={{ value: IconGiftFilled }}>
      <div className="flex items-center gap-1">
        <Typography className="text-base">
          {birthday ? dayjs(birthday).format("DD MMM YYYY") : `не указано`}
        </Typography>
      </div>
    </UserSettingOption>
  )
}, "BirthdayOption")

const RealnameOption = reatomComponent(({ ctx }) => {
  return (
    <UserSettingOption onClick={() => navigateToDialogAction(ctx, "real-name")} title="Реальное имя" icon={{ value: IconLabel }}>
      <div className="flex items-center gap-1">
        <Typography className="text-base">
          {getUser(ctx).real_name ?? 'нет'}
        </Typography>
      </div>
    </UserSettingOption>
  )
}, "RealnameOption")

const NamecolorOption = reatomComponent(({ ctx }) => {
  return (
    <UserSettingOption onClick={() => navigateToDialogAction(ctx, "name-color")} title="Цвет никнейма" icon={{ value: IconKeyframeFilled }}>
      <div
        className={`flex items-center px-4 py-1 backdrop-blur-md rounded-md`}
        style={{
          backgroundColor: hexToRgba({ hex: getUser(ctx).name_color, alpha: 0.3 }),
        }}
      >
        <Typography className="text-base font-semibold" style={{ color: getUser(ctx).name_color }}>
          {getUser(ctx).name_color.toString()}
        </Typography>
      </div>
    </UserSettingOption>
  )
}, "NamecolorOption")

// const FavoriteItemOption = reatomComponent(({ ctx }) => {
//   const favoriteItem = ctx.spy(favoriteItemAtom)

//   return (
//     <>
//       <SyncFavoriteItem target={getUser(ctx).nickname} />
//       <UserSettingOption
//         title="Любимый предмет"
//         imageSrc={DiamondPickaxe}
//         onClick={() => navigateToDialogAction(ctx, "favorite-item")}
//       >
//         <div className="flex items-center gap-1">
//           <Typography className="text-base">
//             {favoriteItem ? favoriteItem.title : "не выбрано"}
//           </Typography>
//         </div>
//       </UserSettingOption>
//     </>
//   )
// })

const DateBirthday = reatomComponent(({ ctx }) => {
  const birthday = getUser(ctx).birthday;
  const initDate = parseDateOrTimestamp(birthday ?? null) as string | null;

  return (
    <Suspense>
      <DatePicker init={initDate ?? null} />
    </Suspense>
  );
}, "DateBirthday")

const PROFILE_SETTINGS_SECTION: Record<ProfileDialog, ReactNode> = {
  birthday: <DateBirthday />,
  "real-name": <RealNameChange />,
  "name-color": <NicknameColorPicker />,
  "favorite-item": null,
  visibility: <ProfileVisibilityChange />,
}

export const UserProfileSettings = reatomComponent(({ ctx }) => {
  const donate = getUser(ctx).donate;
  const isAccess = donate !== "default";
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
                <Separator className="relative bg-authentic-background brightness-150 mb-2">
                  <Typography className="absolute z-2 -top-0 left-0 text-authentic-background text-[14px]">
                    only Fasberry+
                  </Typography>
                </Separator>
                <NamecolorOption />
                <UserSettingOption title="Обводка вокруг шапки профиля" icon={{ value: IconBorderCorners }}>
                  <OutlineCover />
                </UserSettingOption>
                {/* <FavoriteItemOption /> */}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}, "UserProfileSettings")