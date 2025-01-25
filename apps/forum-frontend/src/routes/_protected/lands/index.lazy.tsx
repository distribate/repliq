import { BlockWrapper } from '@repo/components/src/wrappers/block-wrapper'
import { landsClient } from '@repo/shared/api/minecraft-client'
import { Typography } from '@repo/ui/src/components/typography'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createLazyFileRoute, Link } from '@tanstack/react-router'
import SteveSnowRunning from '@repo/assets/images/steve_snow_running.jpg'
import { Suspense } from 'react'

export const Route = createLazyFileRoute('/_protected/lands/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ['lands'],
      queryFn: () => getLands(),
    })
  },
  head: () => ({
    meta: [
      {
        title: 'Территории',
      },
    ],
  }),
})

async function getLands() {
  const res = await landsClient.lands['get-lands'].$get({
    query: {
      cursor: '',
    },
  })

  const data = await res.json()

  if (!data || 'error' in data) return null

  return data
}

function RouteComponent() {
  const { data } = useSuspenseQuery({
    queryKey: ['lands'],
    queryFn: () => getLands(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  if (!data) return null

  const lands = data.data

  return (
    <div className="flex flex-col gap-y-4 w-full h-full">
      <div className="flex lg:flex-row flex-col w-full gap-2">
        <BlockWrapper className="flex flex-col gap-y-6 w-full !p-4">
          <Typography
            textSize="very_big"
            textColor="shark_white"
            className="font-semibold"
          >
            Территории сервера
          </Typography>
          <div className="flex flex-col gap-y-4 w-full">
            <Suspense>
              {lands.map((land) => (
                <Link
                  // @ts-ignore
                  to={`/lands/${land.ulid}`}
                  key={land.ulid}
                  className="flex items-center gap-4 overflow-hidden rounded-md bg-shark-800 hover:bg-shark-700 border border-shark-700 p-2"
                >
                  <img
                    src={SteveSnowRunning}
                    alt=""
                    width={64}
                    height={64}
                    className="rounded-md"
                  />
                  <Typography className="text-[20px] font-[Minecraft]">
                    {land.name} {land.title ? `(${land.title})` : ''}
                  </Typography>
                </Link>
              ))}
            </Suspense>
          </div>
        </BlockWrapper>
      </div>
    </div>
  )
}
