import { BlockWrapper } from '@repo/components/src/wrappers/block-wrapper'
import { Typography } from '@repo/ui/src/components/typography'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_protected/collection')({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: 'Коллекции',
      },
    ],
  }),
})

function RouteComponent() {
  return (
    <div className="flex lg:flex-row flex-col w-full gap-2">
      <BlockWrapper className="flex flex-col gap-y-2 w-full !p-4">
        <Typography textSize="very_big" textColor="shark_white" className="font-semibold">
          Ваша коллекция
        </Typography>
      </BlockWrapper>
    </div>
  )
}
