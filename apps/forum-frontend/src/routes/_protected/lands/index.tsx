import { BlockWrapper } from '#components/wrappers/components/block-wrapper'
import { Typography } from '@repo/ui/src/components/typography'
import { createFileRoute } from '@tanstack/react-router'
// @ts-ignore
import LandsPreview from "@repo/assets/images/clan-preview.jpg"
import { LandsList } from "#components/lands/components/lands-list"

const LandsPreviewImage = () => {
  return (
    <div className="flex select-none flex-col items-center justify-end relative overflow-hidden h-[180px] rounded-lg w-full">
      <img
        draggable={false}
        src={LandsPreview}
        alt=""
        width={800}
        height={800}
        className="absolute w-full h-[210px] rounded-lg object-cover"
      />
      <div className="absolute bottom-0 bg-gradient-to-t h-[60px] from-black/60 via-black/20 to-transparent w-full" />
    </div>
  )
}

export const Route = createFileRoute('/_protected/lands/')({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: 'Территории', description: "Территории сервера" }],
  }),
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-y-4 w-full h-full">
      <LandsPreviewImage />
      <div className="flex lg:flex-row flex-col w-full gap-2">
        <BlockWrapper className="flex flex-col gap-y-6 w-full !p-4">
          <Typography className="font-semibold" textSize="very_big">
            Территории сервера
          </Typography>
          <div className="flex flex-col gap-y-4 w-full">
            <LandsList />
          </div>
        </BlockWrapper>
      </div>
    </div>
  )
}