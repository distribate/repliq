import { UserSettingOption } from "#components/user/settings/user-setting-option"
import { Separator } from "@repo/ui/src/components/separator"
import { Typography } from "@repo/ui/src/components/typography"
import { Avatar } from "#components/user/avatar/components/avatar";
import { userStatusAction, userStatusAtom } from "#components/user/avatar/models/user-status.model";
import { UserNickname } from "#components/user/name/nickname";
import { reatomComponent, useUpdate } from "@reatom/npm-react";
import { Button } from "@repo/ui/src/components/button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@repo/ui/src/components/dialog";
import { CustomLink } from "#components/shared/link";
import { BuyDonateModal } from "#components/modals/custom/components/buy-donate-modal";
import { settingsSettingsTypeAtom } from "#components/modals/user-settings/models/user-settings.model";
import { IconAddressBook, IconAdjustments, IconBubblePlus, IconComet, IconStatusChange, IconUserCircle } from "@tabler/icons-react";
import { getUser } from "#components/user/models/current-user.model";

const Sync = ({ target }: { target: string }) => {
  useUpdate((ctx) => userStatusAction(ctx, target), [target])
  return null;
}

const UserPersonalCardHeader = reatomComponent(({ ctx }) => {
  const { nickname, name_color } = getUser(ctx);
  const userStatus = ctx.spy(userStatusAtom)

  const isOnline = userStatus?.status === 'online';

  return (
    <>
      <Sync target={nickname} />
      <div className="flex items-center gap-4 justify-start w-full px-2">
        <Dialog>
          <DialogTrigger>
            <Avatar rounded="medium" propHeight={82} propWidth={82} nickname={nickname} />
          </DialogTrigger>
          <DialogContent withClose={false} className="!p-0 lg:!min-w-fit bg-transparent flex items-center justify-center">
            <div className="flex flex-col gap-4 w-full h-full">
              <Avatar rounded="medium" propHeight={512} propWidth={512} nickname={nickname} />
              <DialogClose>
                <Button className="px-6 bg-shark-50">
                  <Typography className="text-lg font-semibold text-shark-950">
                    Закрыть
                  </Typography>
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
        <div className="flex flex-col items-start">
          <UserNickname nickname={nickname} nicknameColor={name_color} className="text-base font-semibold" />
          <Typography>
            {isOnline ? "онлайн" : "оффлайн"}
          </Typography>
        </div>
      </div>
    </>
  );
}, "UserPersonalCardHeader")

export const UserMainSettings = reatomComponent(({ ctx }) => {
  return (
    <div className="flex flex-col gap-y-4 items-center w-full">
      <Typography variant="dialogTitle">
        Настройки
      </Typography>
      <UserPersonalCardHeader />
      <Separator />
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
    </div>
  )
}, "Main")