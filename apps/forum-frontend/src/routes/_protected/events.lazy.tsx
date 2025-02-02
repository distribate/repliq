import { Typography } from '@repo/ui/src/components/typography'
import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { BlockWrapper } from '@repo/components/src/wrappers/block-wrapper'
// @ts-ignore
import FishingRod from "@repo/assets/images/minecraft/fishing_rod.webp"
import { Button } from '@repo/ui/src/components/button'

export const Route = createLazyFileRoute('/_protected/events')({
  component: RouteComponent,
  // @ts-ignore
  head: () => {
    return {
      meta: [
        {
          title: 'Ивенты',
        },
      ],
    }
  },
})

function RouteComponent() {
  return (
    <div className="flex lg:flex-row flex-col w-full min-h-dvh gap-2">
      <BlockWrapper className="flex flex-col gap-y-6 w-full !p-4">
        <Typography textSize="very_big" textColor="shark_white" className="font-semibold">
          Ивенты
        </Typography>
        <div className="flex flex-col gap-y-4 w-full">
          <div className="flex items-center justify-between w-full rounded-md p-2 border border-shark-700">
            <div className="flex items-center gap-4">
              <img src={FishingRod} alt="" width={48} height={48} />
              <Typography className="text-[18px]">
                Проголосовать за сервер
              </Typography>
            </div>
            <Link
              // @ts-ignore
              to={`https://hotmc.ru/minecraft-server-259308`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button state="default">
                <Typography>
                  Отдать голос
                </Typography>
              </Button>
            </Link>
          </div>
        </div>
      </BlockWrapper>
    </div>
    // <div className="flex w-full items-center justify-center h-full gap-12 px-12 py-6 relative">
    //   <div className="flex flex-col items-center gap-y-4">
    //     <img src={Events} alt="" width={256} height={256} />
    //     <Typography className="text-xl font-bold text-shark-50">
    //       Ивентов пока нет
    //     </Typography>
    //   </div>
    // </div>
  )
}
