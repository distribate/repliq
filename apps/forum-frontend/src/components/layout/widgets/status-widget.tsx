import { createQueryKey } from "@repo/lib/helpers/query-key-builder"
import { forumLandingClient } from "@repo/shared/api/forum-client"
import { Skeleton } from "@repo/ui/src/components/skeleton"
import { Typography } from "@repo/ui/src/components/typography"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

async function getServerStatus() {
  const res = await forumLandingClient["get-status"].$get({
    query: {
      type: "servers"
    }
  })

  const data = await res.json()

  if ("error" in data) {
    return null
  }

  return data
}

const statusQuery = () => useQuery({
  queryKey: createQueryKey("ui", ["status-servers"]),
  queryFn: getServerStatus,
  refetchOnWindowFocus: false,
  refetchInterval: 60000,
  retry: 1
})

export const StatusWidget = () => {
  const { data, isLoading } = statusQuery()

  const copyClipboard = async () => {
    toast.info("Скопировано!")

    await navigator.clipboard.writeText("mc.fasberry.su")
  }

  return (
    <div className="relative rounded-lg overflow-hidden">
      <img
        src="https://kong.fasberry.su/storage/v1/object/public/static/minecraft/backrooms-art.webp"
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
            {isLoading ? (
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
}