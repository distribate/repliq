import { createLazyFileRoute } from '@tanstack/react-router'
import { BlockWrapper } from '@repo/components/src/wrappers/block-wrapper.tsx'
import { Typography } from '@repo/ui/src/components/typography.tsx'
import { CreateThreadForm } from '@repo/components/src/forms/create-thread/components/create-thread-form.tsx'
import { FormThreadRecommendations } from '@repo/components/src/forms/create-thread/components/form-thread-recommendations.tsx'

export const Route = createLazyFileRoute('/_protected/(actions)/create-thread')({
  component: RouteComponent,
  // @ts-ignore
  head: () => ({
    meta: [
      {
        title: 'Создать тред',
      },
    ],
  }),
})

function RouteComponent() {
  return (
    <div className="flex flex-col w-full h-full gap-4">
      <BlockWrapper className="flex flex-col gap-y-4 w-full !p-4">
        <Typography textSize="big" textColor="shark_white">
          Создание треда
        </Typography>
        <FormThreadRecommendations />
      </BlockWrapper>
      <CreateThreadForm />
    </div>
  )
}