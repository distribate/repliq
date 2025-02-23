import { Typography } from '@repo/ui/src/components/typography'
import { createLazyFileRoute, Link } from '@tanstack/react-router'
import SteveNight from "@repo/assets/images/steve_night.jpg"
import Looking from "@repo/assets/images/looking.jpg"

export const Route = createLazyFileRoute('/_public/start/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex h-screen overflow-hidden items-center w-full justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 p-4 grid-rows-2 lg:grid-rows-1 w-full lg:w-1/2 xl:w-1/3 gap-4">
        <Link
          to="/"
          className="flex items-center overflow-hidden lg:aspect-square relative justify-center p-4 rounded-xl bg-shark-900 border-2 border-shark-800"
        >
          <img src={SteveNight} width={1000} height={1000} alt="" className="absolute w-full h-full object-cover" />
          <div className="h-1/3 bg-gradient-to-t from-black/90 via-black/80 to-transparent w-full absolute bottom-0 z-[1]" />
          <div className="flex h-full justify-center w-full relative z-[2] items-end">
            <Typography className="font-[Minecraft] text-xl text-center">
              К форуму
            </Typography>
          </div>
        </Link>
        <Link
          // @ts-ignore
          to="https://fasberry.su/start"
          className="flex lg:aspect-square overflow-hidden items-center relative justify-center p-4 rounded-xl bg-shark-900 border-2 border-shark-800"
        >
          <img src={Looking} width={1000} height={1000} alt="" className="absolute w-full h-full object-cover" />
          <div className="h-1/3 bg-gradient-to-t from-black/90 via-black/80 to-transparent w-full absolute bottom-0 z-[1]" />
          <div className="flex h-full justify-center w-full relative z-[2] items-end">
            <Typography className="font-[Minecraft] text-xl text-center">
              Как начать играть
            </Typography>
          </div>
        </Link>
      </div>
    </div>
  )
}
