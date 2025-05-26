import { reatomComponent } from "@reatom/npm-react"
import { globalPreferencesAtom } from "@repo/lib/queries/global-preferences-query"
import { Skeleton } from "@repo/ui/src/components/skeleton"
import { Typography } from "@repo/ui/src/components/typography"
import { toast } from "sonner"
import { statusResource } from "./status-widget.model"

export const StatusWidget = reatomComponent(({ ctx }) => {
  const isEnabled = ctx.spy(globalPreferencesAtom).intro === 'show'
  const data = ctx.spy(statusResource.dataAtom)

  const copyClipboard = async () => {
    toast.info("Скопировано!")
    await navigator.clipboard.writeText("mc.fasberry.su")
  }

  if (!isEnabled) return null;
  
  return (
    <div className="relative rounded-lg overflow-hidden">
      <img
        src="https://kong.fasberry.su/storage/v1/object/public/static/widgets/server-status-widget.png"
        alt=""
        width={1000}
        height={600}
        className="absolute h-full w-full object-cover"
      />
      <div
        className="flex relative items-center select-none justify-start w-full max-h-[400px] p-6 md:p-8 lg:p-12 
          bg-gradient-to-r from-black/80 via-black/60 to-transparent"
      >
        <div className="flex flex-col gap-4 w-full">
          <Typography textSize="big" className="font-semibold">
            Добро пожаловать!
          </Typography>
          <Typography className="text-[17px] w-full lg:w-[60%]">
            Аутентичность, приятное общение и полу-ванильный геймплей. 
            Здесь вы можете встретить атмосферную локацию спавна, квесты, персонажей,
            а также огромную систему прокачки навыков. Присоединяйтесь и станьте частью нашего сообщества!
          </Typography>
          <div className="flex items-center gap-1 w-fit">
            <span className="animate-pulse mr-1 text-[24px] font-semibold ease-in-out text-green-500">
              ◈
            </span>
            {ctx.spy(statusResource.statusesAtom).isPending ? (
              <Skeleton className="h-4 w-4" />
            ) : (
              <Typography className="font-semibold text-[17px]">
                {data?.data.proxy.online}
              </Typography>
            )}
            <Typography className="text-[17px]">
              игроков играет прямо сейчас
            </Typography>
          </div>
          <div className="flex items-center gap-2 w-full">
            <div onClick={copyClipboard} className="flex cursor-pointer bg-shark-50 text-shark-950 w-fit px-4 py-1 rounded-lg">
              <Typography className="font-semibold text-[17px]">
                mc.fasberry.su
              </Typography>
            </div>
            <div className="flex bg-shark-50 text-shark-950 w-fit px-4 py-1 rounded-lg">
              <Typography className="font-semibold text-[17px]">
                1.20.1+
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}, "StatusWidget")