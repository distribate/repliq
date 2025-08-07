import { BlockWrapper } from '#components/wrappers/components/block-wrapper'
import { Typography } from '@repo/ui/src/components/typography.tsx'
import { reatomComponent } from '@reatom/npm-react'
import { userGlobalOptionsAtom } from '#components/user/models/current-user.model'
import { CreateThreadForm } from '#components/thread/create-thread/components/form-thread'

export default function Page() {
  return (
    <>
      <CreateThreadRouteComponent />
    </>
  )
}

const CreateThreadRouteComponent = reatomComponent(({ ctx }) => {
  const isAllowed = ctx.spy(userGlobalOptionsAtom).can_create_threads

  return (
    <div className="flex flex-col w-full h-full gap-4">
      {isAllowed ? (
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
}, "CreateThreadRouteComponent")