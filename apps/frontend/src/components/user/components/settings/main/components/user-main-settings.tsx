import {
  IconAddressBook,
  IconAdjustments,
  IconBubblePlus,
  IconCheck,
  IconComet,
  IconLogout,
  IconStatusChange,
  IconUpload,
  IconUserCircle,
  IconX
} from "@tabler/icons-react";
import { UserSettingOption } from "#ui/user-setting-option"
import { Separator } from "@repo/ui/src/components/separator"
import { Typography } from "@repo/ui/src/components/typography"
import { userActivityStatusAction, userActivityStatusAtom } from "#components/user/components/avatar/models/user-status.model";
import { UserNickname } from "#components/user/components/name/nickname";
import { reatomComponent, useUpdate } from "@reatom/npm-react";
import { DialogClose } from "@repo/ui/src/components/dialog";
import { CustomLink } from "#shared/components/link";
import { BuyDonateModal } from "#components/modals/custom/buy-donate-modal";
import { settingsSettingsTypeAtom } from "#components/modals/user-settings/models/user-settings.model";
import { getUser } from "#components/user/models/current-user.model";
import { useRef } from "react";
import { WindowLoader } from "@repo/ui/src/components/window-loader";
import { logoutModalIsOpenAtom } from "#components/modals/with-confirm/logout/models/logout.model";
import { spawn } from "@reatom/framework";
import { cva } from "class-variance-authority";
import { avatarOnChange, createAvatar, resetUploadedChanges, uploadedAvatarUrlAtom } from "#components/user/components/avatar/models/avatar.model";

const Sync = ({ target }: { target: string }) => {
  useUpdate((ctx) => userActivityStatusAction(ctx, target), [target])
  return null;
}

const updateAvatarVariant = cva(
  `absolute inset-0 duration-150 ease-in-out rounded-sm bg-black/50 backdrop-blur-md z-[1] group-hover:opacity-100 opacity-0`
)

const UpdateAvatar = reatomComponent(({ ctx }) => {
  const ref = useRef<HTMLInputElement | null>(null)
  const isPending = ctx.spy(createAvatar.statusesAtom).isPending

  if (isPending) {
    return (
      <div className="absolute inset-0 flex items-center justify-center duration-300 rounded-sm bg-black/50 backdrop-blur-md z-[1]">
        <WindowLoader size="small" />
      </div>
    )
  }

  const uploadedAvatar = ctx.spy(uploadedAvatarUrlAtom)

  const handle = () => {
    void spawn(ctx, async (spawnCtx) => createAvatar(spawnCtx))
  }

  return (
    <>
      <div className={updateAvatarVariant()}>
        <div
          className="flex cursor-pointer justify-center items-center w-full h-full"
          onClick={() => ref?.current?.click()}
        >
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
      {uploadedAvatar && (
        <div className="flex w-full items-center justify-center gap-2 absolute z-[1]  -bottom-4">
          <div className="flex items-center justify-center cursor-pointer hover:bg-shark-100 bg-shark-50 rounded-md p-1">
            <IconCheck
              className="text-green-500"
              onClick={handle}
            />
          </div>
          <div className="flex items-center justify-center cursor-pointer hover:bg-shark-100 bg-shark-50 rounded-md p-1">
            <IconX
              className="text-red-500"
              onClick={() => resetUploadedChanges(ctx)}
            />
          </div>
        </div>
      )}
    </>
  )
}, "UpdateAvatar")

const MainAvatar = reatomComponent(({ ctx }) => {
  const { nickname, name_color, avatar } = getUser(ctx);
  const userStatus = ctx.spy(userActivityStatusAtom)

  const isOnline = userStatus?.status === 'online';

  const uploadedAvatar = ctx.spy(uploadedAvatarUrlAtom)
  const avatarUrl = uploadedAvatar === null ? avatar : uploadedAvatar

  return (
    <>
      <Sync target={nickname} />
      <div className="flex flex-col items-center gap-4 justify-center w-full">
        <div className="relative group max-h-[104px] max-w-[104px]">
          <UpdateAvatar />
          {avatarUrl ? (
            <img src={avatarUrl} className="object-cover rounded-lg max-h-[104px] max-w-[104px]" height={104} width={104} />
          ) : (
            <div className="flex items-center bg-shark-700 justify-center h-[104px] w-[104px] rounded-lg">
              <span className="text-xl">
                {nickname[0].toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center">
          <UserNickname nickname={nickname} nicknameColor={name_color} className="text-xl font-semibold" />
          <Typography>{isOnline ? "онлайн" : "оффлайн"}</Typography>
        </div>
      </div>
    </>
  );
}, "UserPersonalCardHeader")

const Logout = reatomComponent(({ ctx }) => {
  const handle = () => {
    requestAnimationFrame(() => logoutModalIsOpenAtom(ctx, true));
  }

  return (
    <DialogClose className="w-full">
      <UserSettingOption
        onClick={handle}
        title="Выйти"
        icon={{ value: IconLogout, className: "text-red-600" }}
      />
    </DialogClose>
  )
}, "Logout")

const Options = reatomComponent(({ ctx }) => {
  const { is_donate } = getUser(ctx)

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
      {!is_donate && (
        <>
          <Separator />
          <DialogClose asChild className="w-full">
            <BuyDonateModal
              trigger={
                <UserSettingOption title="Донат" icon={{ value: IconComet, className: "text-green-600" }} />
              }
            />
          </DialogClose>
        </>
      )}
      <Separator />
      <CustomLink to="/create-ticket">
        <DialogClose className="w-full">
          <UserSettingOption title="Задать вопрос" icon={{ value: IconBubblePlus }} />
        </DialogClose>
      </CustomLink>
      <CustomLink to="/news">
        <DialogClose className="w-full">
          <UserSettingOption title="Новости" icon={{ value: IconStatusChange }} />
        </DialogClose>
      </CustomLink>
      <Logout />
    </div>
  )
}, "Options")

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