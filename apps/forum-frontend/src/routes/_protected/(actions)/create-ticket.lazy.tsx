import { BlockWrapper } from '#components/wrappers/components/block-wrapper'
import { Typography } from '@repo/ui/src/components/typography'
import { createLazyFileRoute } from '@tanstack/react-router'
import { CreateIssueForm } from '#components/forms/create-issue/components/create-issue-form'

export const Route = createLazyFileRoute('/_protected/(actions)/create-ticket')({
  component: RouteComponent,
  // @ts-ignore
  head: () => ({ meta: [{ title: "Создать тикет" }] }),
})

function RouteComponent() {
  return (
    <div className="flex flex-col w-full h-full gap-4">
      <BlockWrapper className="flex flex-col gap-y-4 w-full !p-4">
        <Typography textSize="big" textColor="shark_white">
          Сообщить о проблеме или идее
        </Typography>
      </BlockWrapper>
      <CreateIssueForm />
    </div>
  )
}