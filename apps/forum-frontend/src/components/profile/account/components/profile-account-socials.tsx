import { Skeleton } from "@repo/ui/src/components/skeleton"
import { discordAtom, telegramAtom, userSocialsResource } from "../models/user-socials.model"
import { Typography } from "@repo/ui/src/components/typography"
import { reatomComponent } from "@reatom/npm-react"
import DiscordLogo from "@repo/assets/images/discord-logo.jpg"
import TelegramLogo from "@repo/assets/images/telegram-logo.png"
import { Button } from "@repo/ui/src/components/button";
import { Dialog, DialogContent } from "@repo/ui/src/components/dialog";
import { toast } from "sonner";
import { reatomAsync, withStatusesAtom } from "@reatom/async"
import { forumRootClient } from "@repo/shared/api/forum-client"
import { atom } from "@reatom/core"
import { WindowLoader } from "@repo/ui/src/components/window-loader"
import { reatomTimer } from "@reatom/timer"
import { withReset } from "@reatom/framework"

type SocialsCardProps = {
  title: string,
  value: string | null
  service: Connect["service"]
}

const socialsImages: Record<string, string> = {
  "Telegram": TelegramLogo,
  "Discord": DiscordLogo,
}

const connectDialogIsOpenAtom = atom(false, "connectDialogIsOpen")
const connectUrlAtom = atom<string | null>(null, "connectUrlAtom").pipe(withReset())

type Connect = {
  type: "connect" | "cancel" | "disconnect"
  service: "telegram" | "discord",
  signal: AbortSignal,
}

const connectTimer = reatomTimer({
  interval: 1000,
  delayMultiplier: 1000,
  progressPrecision: 2,
  resetProgress: true,
})

const remainsAtom = atom((ctx) => (ctx.spy(connectTimer) / 1000).toFixed(1))

const request = async ({ type, signal, service }: Connect) => {
  const res = await forumRootClient.connect.$post({ query: { service, type } }, { init: { signal } })
  const data = await res.json()
  return data
}

const CONNECT_ERROR_MAP: Record<string, string> = {
  "Exists token": "Подождите до этого действия"
}

const connectActionVariablesAtom = atom<Omit<Connect, "signal"> | null>(null, "connectActionVariables")
const connectAction = reatomAsync(async (ctx, type: Connect["type"], service: Connect["service"]) => {
  connectDialogIsOpenAtom(ctx, true)

  const isProccessed = ctx.get(connectActionVariablesAtom)

  if (isProccessed) {
    return;
  }

  connectActionVariablesAtom(ctx, { type, service })

  return await ctx.schedule(() => request({ service, type, signal: ctx.controller.signal }))
}, {
  name: "connectAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    if ("error" in res) {
      toast.error(CONNECT_ERROR_MAP[res.error] ?? res.error)
      connectDialogIsOpenAtom(ctx, false)
      return
    }

    const variables = ctx.get(connectActionVariablesAtom)
    if (!variables) return;

    const { type, service } = variables

    if (type === 'connect') {
      connectUrlAtom(ctx, res.data)
      connectTimer.startTimer(ctx, 5 * 60)
    }

    if (type === 'cancel') {
      connectUrlAtom.reset(ctx)
      connectDialogIsOpenAtom(ctx, false)
    }

    if (type === 'disconnect' && service === 'telegram') {
      telegramAtom.reset(ctx)
      connectDialogIsOpenAtom(ctx, false)
      toast.success("Телеграм отвязан")
    }
  }
}).pipe(withStatusesAtom())

const Remains = reatomComponent(({ ctx }) => {
  return (
    <Typography>
      Ссылка будет активна в течении {ctx.spy(remainsAtom)}
    </Typography>
  )
}, "Remains")

const SocialsSupportDialog = reatomComponent<{ service: Connect["service"] }>(({ ctx, service }) => {
  const url = ctx.spy(connectUrlAtom)

  const handleCopyLink = async () => {
    if (!url) return;
    await navigator.clipboard.writeText(url)
    toast.info("Ссылка скопирована в буфер обмена")
  }

  return (
    <Dialog open={ctx.spy(connectDialogIsOpenAtom)} onOpenChange={(v) => connectDialogIsOpenAtom(ctx, v)}>
      <DialogContent>
        <div className="flex flex-col items-center gap-4 w-full h-full">
          <Typography variant="dialogTitle">
            Привязка Telegram к аккаунту
          </Typography>
          {url ? (
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
            </div>
          ) : (
            <div className="flex flex-col gap-4 p-2 items-center justify-center">
              <WindowLoader />
              <Typography textSize="large">Инициализируем...</Typography>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}, "SocialsSupportDialog")

export const SocialsCard = reatomComponent<SocialsCardProps>(({ ctx, title, value, service }) => {
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
            <Button
              className="bg-shark-50 w-1/2"
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
          <SocialsSupportDialog service={service} />
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
}, "SocialsCard")

export const ProfileAccountSocials = reatomComponent(({ ctx }) => {
  const userSocials = ctx.spy(userSocialsResource.dataAtom)
  const isLoading = ctx.spy(userSocialsResource.statusesAtom).isPending

  const discord = ctx.spy(discordAtom)
  const tg = ctx.spy(telegramAtom)

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-1 w-fit">
          <Typography
            textColor="shark_white"
            textSize="big"
            className="font-semibold"
          >
            Привязанные соцсети
          </Typography>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 auto-rows-auto gap-4 w-full h-full">
        {isLoading && (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        )}
        {!isLoading && (
          <>
            <SocialsCard
              title="Discord"
              service="discord"
              value={discord?.value ?? null}
            />
            <SocialsCard
              service="telegram"
              title="Telegram"
              value={tg?.value ?? null}
            />
          </>
        )}
      </div>
    </div>
  )
}, "ProfileAccountSocials")