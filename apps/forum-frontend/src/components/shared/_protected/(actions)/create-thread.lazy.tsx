import { BlockWrapper } from '#components/wrappers/components/block-wrapper'
import { Typography } from '@repo/ui/src/components/typography.tsx'
import { CreateThreadForm } from '#components/forms/create-thread/components/form-thread'
import { reatomComponent } from '@reatom/npm-react'
import { userGlobalOptionsAtom } from '@repo/lib/helpers/get-user'

const Page = reatomComponent(({ ctx }) => {
  const can_create_threads = ctx.spy(userGlobalOptionsAtom).can_create_threads

  return (
    <div className="flex flex-col w-full h-full gap-4">
      {can_create_threads ? (
        <CreateThreadForm />
      ) : (
        <BlockWrapper className="flex flex-col gap-y-4 w-full !p-4">
          <Typography textSize="big" className="text-red-500">
            Вы не можете создавать треды
          </Typography>
        </BlockWrapper>
      )}
    </div>
  )
}, "RouteComponent")

export function CreateThreadRouteComponent() {
  return (
    <Page />
  )
}