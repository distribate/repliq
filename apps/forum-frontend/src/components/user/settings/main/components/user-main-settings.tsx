import { UserSettingOption } from "#components/user/settings/user-setting-option"
import { Separator } from "@repo/ui/src/components/separator"
import { Typography } from "@repo/ui/src/components/typography"
import { userStatusAction, userStatusAtom } from "#components/user/avatar/models/user-status.model";
import { UserNickname } from "#components/user/name/nickname";
import { reatomComponent, useUpdate } from "@reatom/npm-react";
import { DialogClose } from "@repo/ui/src/components/dialog";
import { CustomLink } from "#components/shared/link";
import { BuyDonateModal } from "#components/modals/custom/components/buy-donate-modal";
import { settingsSettingsTypeAtom } from "#components/modals/user-settings/models/user-settings.model";
import { IconAddressBook, IconAdjustments, IconBubblePlus, IconCheck, IconComet, IconStatusChange, IconUpload, IconUserCircle, IconX } from "@tabler/icons-react";
import { getUser } from "#components/user/models/current-user.model";
import { avatarOnChange, updateAvatarAction, updateAvatarAtom } from "#components/user/settings/main/models/cover-avatar.model";
import { useRef } from "react";
import { WindowLoader } from "@repo/ui/src/components/window-loader";

const Sync = ({ target }: { target: string }) => {
  useUpdate((ctx) => userStatusAction(ctx, target), [target])
  return null;
}

const UpdateAvatar = reatomComponent(({ ctx }) => {
  const ref = useRef<HTMLInputElement | null>(null)

  const isPending = ctx.spy(updateAvatarAction.statusesAtom).isPending

  if (isPending) {
    return (
      <div className="absolute inset-0 flex items-center justify-center duration-300 rounded-sm bg-black/50 backdrop-blur-md z-[1]">
        <WindowLoader size="small" />
      </div>
    )
  }

  return (
    <>
      <div className="absolute inset-0 duration-300 rounded-sm bg-black/50 backdrop-blur-md z-[1] group-hover:opacity-100 opacity-0">
        <div onClick={() => ref?.current?.click()} className="flex cursor-pointer justify-center items-center w-full h-full">
          <IconUpload size={26} />
          <input
            type="file"
            multiple={false}
            ref={ref}
            className="hidden"
            onChange={e => avatarOnChange(ctx, e)}
          />
        </div>
      </div>
      {ctx.spy(updateAvatarAtom) && (
        <div className="flex w-full items-center justify-center gap-2 absolute z-[1]  -bottom-4">
          <div className="flex items-center justify-center cursor-pointer hover:bg-shark-100 bg-shark-50 rounded-md p-1">
            <IconCheck
              onClick={() => updateAvatarAction(ctx)}
              className="text-green-500"
            />
          </div>
          <div className="flex items-center justify-center cursor-pointer hover:bg-shark-100 bg-shark-50 rounded-md p-1">
            <IconX
              onClick={() => updateAvatarAtom.reset(ctx)}
              className="text-red-500"
            />
          </div>
        </div>
      )}
    </>
  )
}, "UpdateAvatar")

const MainAvatar = reatomComponent(({ ctx }) => {
  const { nickname, name_color, avatar } = getUser(ctx);
  const userStatus = ctx.spy(userStatusAtom)

  const isOnline = userStatus?.status === 'online';

  const uploadedAvatar = ctx.spy(updateAvatarAtom)
  const avatarUrl = uploadedAvatar === null ? avatar : uploadedAvatar

  return (
    <>
      <Sync target={nickname} />
      <div className="flex items-center gap-4 justify-start w-full px-2">
        <div className="relative group">
          <UpdateAvatar />
          {avatarUrl ? (
            <img src={avatarUrl} className="rounded-md" height={104} width={104} />
          ) : (
            <div className="flex items-center justify-center h-[104px] w-[104px] rounded-md">
              <span className="text-xl">{nickname[0].toUpperCase()}</span>
            </div>
          )}
        </div>
        <div className="flex flex-col items-start">
          <UserNickname nickname={nickname} nicknameColor={name_color} className="text-xl font-semibold" />
          <Typography>
            {isOnline ? "онлайн" : "оффлайн"}
          </Typography>
        </div>
      </div>
    </>
  );
}, "UserPersonalCardHeader")

const Options = reatomComponent(({ ctx }) => {
  return (
    <div className="flex flex-col gap-y-2 w-full">
      <UserSettingOption
        onClick={() => settingsSettingsTypeAtom(ctx, "profile")}
        title="Профиль"
        icon={{ value: IconAddressBook }}
      />
      <UserSettingOption
        onClick={() => settingsSettingsTypeAtom(ctx, "account")}
        title="Аккаунт"
        icon={{ value: IconUserCircle }}
      />
      <UserSettingOption
        onClick={() => settingsSettingsTypeAtom(ctx, "other")}
        title="Прочее"
        icon={{ value: IconAdjustments }}
      />
      {!getUser(ctx).is_donate && (
        <>
          <Separator />
          <BuyDonateModal
            trigger={
              <UserSettingOption title="Донат" icon={{ value: IconComet, className: "text-pink-500" }} />
            }
          />
        </>
      )}
      <Separator />
      <CustomLink to="/create-ticket">
        <DialogClose className="w-full">
          <UserSettingOption title="Задать вопрос" icon={{ value: IconBubblePlus }} />
        </DialogClose>
      </CustomLink>
      <CustomLink to="/news/changelog">
        <DialogClose className="w-full">
          <UserSettingOption title="Обновления" icon={{ value: IconStatusChange }} />
        </DialogClose>
      </CustomLink>
    </div>
  )
}, "")

export const UserMainSettings = () => {
  return (
    <div className="flex flex-col gap-y-4 items-center w-full">
      <Typography variant="dialogTitle">
        Настройки
      </Typography>
      <MainAvatar />
      <Separator />
      <Options />
    </div>
  )
}