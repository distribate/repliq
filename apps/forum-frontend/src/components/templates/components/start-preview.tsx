import { GLOBAL_OPTION_QUERY_KEY, globalOptionQuery } from "@repo/lib/queries/global-option-query"
import { Typography } from "@repo/ui/src/components/typography"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import SteveNight from "@repo/assets/images/steve_night.jpg"
import Looking from "@repo/assets/images/looking.jpg"

export const StartPreview = () => {
  const qc = useQueryClient()
  const { isStarted } = globalOptionQuery().data
  const navigate = useNavigate()

  const toggleChoise = (variant: "forum" | "get-start") => {
    switch (variant) {
      case "forum":
        qc.setQueryData(GLOBAL_OPTION_QUERY_KEY, { isStarted: false })
        return navigate({ to: "/", })
      case "get-start":
        return navigate({
          href: "https://fasberry.su/start",
          reloadDocument: true
        })
    }
  }

  return (
    <div
      className={`flex h-screen  overflow-hidden items-center w-full justify-center transition duration-500
        ${isStarted ? "opacity-100" : "opacity-0"}`}
    >
      <div className="flex lg:flex-row lg:*:w-1/3 *:h-1/3 *:aspect-square flex-col w-full h-full items-center justify-center gap-4">
        <div
          onClick={() => toggleChoise("forum")}
          className="flex items-center overflow-hidden relative justify-center p-4 bg-shark-900 group border-2 border-shark-300"
        >
          <img
            src={SteveNight}
            width={1000}
            height={1000}
            alt=""
            className="absolute w-full h-full object-cover group-hover:scale-105 ease-in-out transition-all duration-300"
          />
          <div className="h-1/3 bg-gradient-to-t from-black/90 via-black/80 to-transparent w-full absolute bottom-0 z-[1]" />
          <div className="flex h-full justify-center w-full relative z-[2] items-end">
            <Typography className="font-[Minecraft] text-2xl text-center">
              К форуму
            </Typography>
          </div>
        </div>
        <div
          onClick={() => toggleChoise("get-start")}
          className="flex overflow-hidden items-center relative justify-center p-4 group bg-shark-900 border-2 border-shark-300"
        >
          <img
            src={Looking}
            width={1000}
            height={1000}
            alt=""
            className="absolute w-full h-full object-cover group-hover:scale-105 ease-in-out transition-all duration-300"
          />
          <div className="h-1/3 bg-gradient-to-t from-black/90 via-black/80 to-transparent w-full absolute bottom-0 z-[1]" />
          <div className="flex h-full justify-center w-full relative z-[2] items-end">
            <Typography className="font-[Minecraft] text-2xl text-center">
              Как начать играть
            </Typography>
          </div>
        </div>
      </div>
    </div>
  )
}