import { Typography } from "@repo/ui/src/components/typography";
import DiscordLogo from "@repo/assets/images/discord-logo.jpg"
import TelegramLogo from "@repo/assets/images/telegram-logo.png"
import { Button } from "@repo/ui/src/components/button";
import { Dialog, DialogContent, DialogTrigger } from "@repo/ui/src/components/dialog";
import { toast } from "sonner";
import { getUser } from "@repo/lib/helpers/get-user";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@repo/ui/src/components/tooltip";

type SocialsCardProps = {
  title: string,
  value: string | null
}

const socialsImages: Record<string, string> = {
  "Telegram": TelegramLogo,
  "Discord": DiscordLogo,
}

const SocialsSupport = ({
  children
}: {
  children: React.ReactNode
}) => {
  const { nickname } = getUser()

  const handleCopyLink = async (text: string) => {
    await navigator.clipboard.writeText(text)
    toast.info("Ссылка скопирована в буфер обмена")
  }

  return (
    <Dialog>
      <DialogTrigger className="flex justify-start w-full">
        {children}
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-4 w-full h-full">
          <Typography variant="dialogTitle">
            Привязка соцсетей к аккаунту
          </Typography>
          <div className="flex w-full justify-between p-2 items-center">
            <div className="flex flex-col gap-2 *:text-[17px] items-start w-full">
              <Typography textColor="shark_white">
                Чтобы привязать соцсеть к аккаунту, нужно:
              </Typography>
              <div className="flex flex-col gap-2 w-full h-full">
                <div className="flex flex-col gap-1 w-full h-full">
                  <Typography textColor="shark_white">
                    1. Написать сообщение ниже следующим ботам:
                  </Typography>
                  <Typography textColor="shark_white">
                    Telegram: <a href="https://t.me/fasberry_bot" className="text-shark-300" target="_blank">@fasberry_bot</a>
                  </Typography>
                  <Typography textColor="shark_white">
                    Discord: <span className="text-shark-300">FasberryBot#7635</span>
                  </Typography>
                </div>
                <div className="flex items-center gap-2 w-full">
                  <Typography textColor="shark_white">
                    Сообщение:
                  </Typography>
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger className="w-fit">
                        <div
                          onClick={() => handleCopyLink(`!аккаунт привязать ${nickname}`)}
                          className="flex bg-shark-900 w-fit cursor-pointer rounded-md px-2 py-0.5 items-center justify-start"
                        >
                          <Typography className="italic font-bold text-shark-200" >
                            !аккаунт привязать {nickname}
                          </Typography>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <Typography className="font-semibold text-shark-200">
                          Скопировать текст
                        </Typography>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Typography textColor="shark_white">
                  2. Зайти в игру и ввести команду, которую предложит бот
                </Typography>
                <Typography textColor="shark_white">
                  3. Аккаунт привязан! 🎉
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export const SocialsCard = ({
  title, value
}: SocialsCardProps) => {
  return (
    <div className="flex flex-col gap-2 group p-4 w-full bg-shark-950 rounded-lg relative overflow-hidden">
      <div
        className={`absolute transition-all -bottom-1 -right-1 rounded-lg overflow-hidden ease-in-out
        ${!value && "group-hover:duration-300 duration-300 group-hover:-bottom-32 group-hover:-right-32"}`}
      >
        <img src={socialsImages[title]} alt="" width={64} height={64} />
      </div>
      <Typography className="text-[18px] font-medium">
        {title}
      </Typography>
      {value ? (
        <Typography textColor="gray" className="text-[18px] font-medium">
          ID: {value}
        </Typography>
      ) : (
        <SocialsSupport>
          <Button state="default" className="w-4/5 group-hover:w-full">
            <Typography>
              Привязать
            </Typography>
          </Button>
        </SocialsSupport>
      )}
    </div>
  )
};