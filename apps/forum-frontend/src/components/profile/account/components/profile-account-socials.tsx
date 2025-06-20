import { Skeleton } from "@repo/ui/src/components/skeleton"
import { 
  Connect, 
  connectAction, 
  connectDialogIsOpenAtom, 
  connectRemainsAtom,
  connectUrlAtom, 
  discordAtom, 
  integrationSettingsDialogIsOpenAtom,
  integrationTypeAtom, 
  connectIsSuccessAtom, 
  openIntegrationSettingsAction,
  telegramAtom, 
  userSocialsResource 
} from "../models/user-socials.model"
import { Typography } from "@repo/ui/src/components/typography"
import { reatomComponent } from "@reatom/npm-react"
import DiscordLogo from "@repo/assets/images/discord-logo.jpg"
import TelegramLogo from "@repo/assets/images/telegram-logo.png"
import { Button } from "@repo/ui/src/components/button";
import { Dialog, DialogContent } from "@repo/ui/src/components/dialog";
import { toast } from "sonner";
import { WindowLoader } from "@repo/ui/src/components/window-loader"
import { IconBrandTelegram, IconCheck } from "@tabler/icons-react"
import { spawn } from "@reatom/framework"
import { UserSettingOption } from "#components/user/settings/user-setting-option"
import { Switch } from "@repo/ui/src/components/switch"
import { getUser } from "#components/user/models/current-user.model"
import { updateCurrentUserSettingsAction } from "#components/user/settings/profile/models/update-current-user.model"

const socialsImages: Record<string, string> = {
  "Telegram": TelegramLogo,
  "Discord": DiscordLogo,
}

type SocialsCardProps = {
  title: string,
  value: string | null
  service: Connect["service"]
}

const Remains = reatomComponent(({ ctx }) => {
  return (
    <Typography>Ссылка будет активна в течении {ctx.spy(connectRemainsAtom)}</Typography>
  )
}, "Remains")

const ConnectSocialIsSuccess = () => {
  return (
    <div className="flex flex-col justify-center items-center p-2 gap-4 w-full">
      <IconCheck size={20} className="text-green-500" />
      <Typography textSize="big" className='font-semibold'>
        Готово!
      </Typography>
    </div>
  )
}

const ConnectSocialIsPending = reatomComponent<Pick<Connect, "service">>(({ ctx, service }) => {
  const url = ctx.spy(connectUrlAtom)

  if (!url) {
    return (
      <div className="flex flex-col gap-4 p-2 items-center justify-center">
        <WindowLoader />
        <Typography textSize="large">Инициализируем...</Typography>
      </div>
    )
  }

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(url)
    toast.info("Ссылка скопирована в буфер обмена")
  }

  return (
    <div className="flex justify-center w-full p-2 items-center">
      <div className="flex items-center justify-center w-full flex-col gap-4">
        <div className="flex flex-col">
          <Typography textSize="large">
            Перейдите к боту и введите токен
          </Typography>
          <Remains />
        </div>
        <pre
          onClick={() => handleCopyLink()}
          className="cursor-pointer bg-shark-800 rounded-lg px-3 py-0.5"
        >
          <code>{url}</code>
        </pre>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full justify-center">
          <a href={url} target="_blank" rel="noreferrer">
            <Button
              variant="positive"
              onClick={() => connectAction(ctx, "connect", service)}
            >
              <Typography textSize="medium">
                Перейти к боту
              </Typography>
            </Button>
          </a>
          <Button
            variant="negative"
            onClick={() => connectAction(ctx, "cancel", service)}
          >
            <Typography textSize="medium">
              Отменить
            </Typography>
          </Button>
        </div>
      </div>
    </div >
  )
})

const ConnectSocialDialog = reatomComponent<Pick<Connect, "service">>(({ ctx, service }) => {
  return (
    <Dialog
      open={ctx.spy(connectDialogIsOpenAtom)}
      onOpenChange={(v) => connectDialogIsOpenAtom(ctx, v)}
    >
      <DialogContent>
        <div className="flex flex-col items-center gap-4 w-full h-full">
          <Typography variant="dialogTitle">
            Привязка Telegram к аккаунту
          </Typography>
          {ctx.spy(connectIsSuccessAtom)
            ? <ConnectSocialIsSuccess />
            : <ConnectSocialIsPending service={service} />
          }
        </div >
      </DialogContent >
    </Dialog >
  )
}, "ConnectSocialDialog")

const IntegrationSettingsDialog = reatomComponent(({ ctx }) => {
  const notify_in_telegram = getUser(ctx).preferences.notify_in_telegram

  const handle = () => {
    void spawn(ctx, async (spawnCtx) => updateCurrentUserSettingsAction(spawnCtx, {
      setting: "notify_in_telegram", value: !notify_in_telegram
    }))
  }

  return (
    <Dialog
      open={ctx.spy(integrationSettingsDialogIsOpenAtom)}
      onOpenChange={v => integrationSettingsDialogIsOpenAtom(ctx, v)}
    >
      <DialogContent>
        <div className="flex flex-col items-center gap-4 w-full h-full">
          <Typography variant="dialogTitle">
            Настройки {ctx.spy(integrationTypeAtom)?.title}
          </Typography>
          <UserSettingOption title="Объявления" icon={{ value: IconBrandTelegram }}>
            <Switch
              checked={notify_in_telegram}
              defaultChecked={notify_in_telegram}
              onCheckedChange={handle}
            />
          </UserSettingOption>
        </div>
      </DialogContent>
    </Dialog>
  )
}, "IntegrationSettingsDialog")

export const SocialCard = reatomComponent<SocialsCardProps>(({
  ctx, title, value, service
}) => {
  return (
    <div className="flex flex-col gap-2 group p-4 w-full bg-shark-950 rounded-lg relative overflow-hidden">
      <div
        data-state={value ? "active" : "inactive"}
        className={`absolute transition-all -bottom-1 -right-1 rounded-lg overflow-hidden ease-in-out duration-300
          data-[state=inactive]:group-hover:-bottom-32 data-[state=inactive]:group-hover:-right-32`}
      >
        <img src={socialsImages[title]} alt="" width={64} height={64} />
      </div>
      <Typography className="text-[18px] font-medium">
        {title}
      </Typography>
      {value ? (
        <div className="flex flex-col w-full gap-2">
          <Typography textColor="gray" className="text-[18px]">
            ID: {value}
          </Typography>
          <div className="flex items-center w-4/5 justify-start gap-2">
            <IntegrationSettingsDialog />
            <Button
              className="bg-shark-50 w-1/2"
              onClick={() => openIntegrationSettingsAction(ctx, true, { title, service })}
            >
              <Typography textSize="medium" className="text-shark-950">
                Настроить
              </Typography>
            </Button>
            <Button
              variant="negative"
              className="w-1/2"
              onClick={() => connectAction(ctx, "disconnect", service)}
            >
              <Typography textSize="medium" >
                Отвязать
              </Typography>
            </Button>
          </div>
        </div>
      ) : (
        <>
          <ConnectSocialDialog service={service} />
          <Button
            state="default"
            onClick={() => connectAction(ctx, "connect", service)}
            className="w-4/5 group-hover:w-full"
          >
            <Typography textSize="medium" >
              Привязать
            </Typography>
          </Button>
        </>
      )}
    </div>
  )
}, "SocialCard")

const ProfileAccountSocialsSkeleton = () => {
  return (
    <>
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </>
  )
}

export const ProfileAccountSocials = reatomComponent(({ ctx }) => {
  const userSocials = ctx.spy(userSocialsResource.dataAtom)
  const isLoading = ctx.spy(userSocialsResource.statusesAtom).isPending

  const discord = ctx.spy(discordAtom)
  const tg = ctx.spy(telegramAtom)

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-1 w-fit">
          <Typography textColor="shark_white" textSize="big" className="font-semibold">
            Привязанные соцсети
          </Typography>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 auto-rows-auto gap-4 w-full h-full">
        {isLoading ? <ProfileAccountSocialsSkeleton /> : (
          <>
            <SocialCard title="Discord" service="discord" value={discord?.value ?? null} />
            <SocialCard service="telegram" title="Telegram" value={tg?.value ?? null} />
          </>
        )}
      </div>
    </div>
  )
}, "ProfileAccountSocials")