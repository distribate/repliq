import { BlockWrapper } from '@repo/components/src/wrappers/block-wrapper'
import { Typography } from '@repo/ui/src/components/typography'
import { createFileRoute } from '@tanstack/react-router'
import { Referals } from '@repo/components/src/collection/components/referals'

export const Route = createFileRoute('/_protected/collection')({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: 'Коллекции',
      },
    ],
  }),
  validateSearch: (search) => {
    return {
      type: (search.type as 'threads' | 'saved_threads' | 'referals') || 'all',
    }
  }
})

function RouteComponent() {
  const { type } = Route.useSearch()

  const title = type === 'referals' ? 'рефералы' : 'коллекции'

  return (
    <div className="flex lg:flex-row flex-col w-full gap-2">
      <BlockWrapper className="flex flex-col gap-y-2 w-full !p-4">
        <Typography textSize="very_big" textColor="shark_white" className="font-semibold">
          Ваши {title}
        </Typography>
        {type === 'referals' && <Referals />}
      </BlockWrapper>
    </div>
  )
} 