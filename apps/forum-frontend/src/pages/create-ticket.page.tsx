import { BlockWrapper } from '#components/wrappers/components/block-wrapper'
import { Typography } from '@repo/ui/src/components/typography'
import { CreateIssueForm } from '#components/issue/create-issue/components/create-issue-form'
import { Head } from '@unhead/react'

export function CreateTicketRouteComponent() {
  return (
    <div className="flex flex-col w-full h-full gap-4">
      <Head>
        <title>Создать тикет</title>
      </Head>
      <BlockWrapper className="flex flex-col gap-y-4 w-full !p-4">
        <Typography textSize="big" textColor="shark_white">
          Сообщить о проблеме или идее
        </Typography>
      </BlockWrapper>
      <CreateIssueForm />
    </div>
  )
}