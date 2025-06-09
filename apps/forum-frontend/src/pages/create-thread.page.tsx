import { BlockWrapper } from '#components/wrappers/components/block-wrapper'
import { Typography } from '@repo/ui/src/components/typography.tsx'
import { reatomComponent } from '@reatom/npm-react'
import { userGlobalOptionsAtom } from '@repo/lib/helpers/get-user'
import { Head } from '@unhead/react'
import { lazy, Suspense } from 'react'

const CreateThreadForm = lazy(() => import("#components/thread/create-thread/components/form-thread").then(m => ({ default: m.CreateThreadForm })))

export const CreateThreadRouteComponent = reatomComponent(({ ctx }) => {
  const can_create_threads = ctx.spy(userGlobalOptionsAtom).can_create_threads

  return (
    <>
      <Head>
        <title>Создать тред</title>
      </Head>
      <div className="flex flex-col w-full h-full gap-4">
        {can_create_threads ? (
          <Suspense>
            <CreateThreadForm />
          </Suspense>
        ) : (
          <BlockWrapper className="flex flex-col gap-y-4 w-full !p-4">
            <Typography textSize="big" className="text-red-500">
              Вы не можете создавать треды
            </Typography>
          </BlockWrapper>
        )}
      </div>
    </>
  )
}, "CreateThreadRouteComponent")