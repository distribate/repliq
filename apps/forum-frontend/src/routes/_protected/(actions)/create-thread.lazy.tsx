import { createLazyFileRoute } from '@tanstack/react-router'
import { BlockWrapper } from '@repo/components/src/wrappers/block-wrapper.tsx'
import { Typography } from '@repo/ui/src/components/typography.tsx'
import { CreateThreadForm } from '@repo/components/src/forms/create-thread/components/create-thread-form.tsx'
import { FormThreadRecommendations } from '@repo/components/src/forms/create-thread/components/form-thread-recommendations.tsx'
import { userGlobalOptionsQuery } from '@repo/lib/queries/user-global-options-query'

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
  const { data } = userGlobalOptionsQuery()

  if (!data) return null;

  const { can_create_threads } = data;

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <BlockWrapper className="flex flex-col gap-y-4 w-full !p-4">
        <Typography textSize="big" textColor="shark_white">
          Создание треда
        </Typography>
        <FormThreadRecommendations />
      </BlockWrapper>
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
}