import { Typography } from '@repo/ui/src/components/typography'
import { CreateIssueForm } from '#components/issue/create-issue/components/create-issue-form'
import { reatomComponent } from '@reatom/npm-react'
import { userGlobalOptionsAtom } from '#components/user/models/current-user.model'
import { IconX } from '@tabler/icons-react'
import { CustomLink } from '#shared/components/link'

const Prevent = () => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full md:h-[80dvh]">
      <IconX size={128} className="text-red-500" />
      <Typography className="text-2xl text-center font-semibold w-full lg:w-[60%]">
        Вы уже создали тикет сегодня!
      </Typography>
      <Typography className="text-center text-base">
        Отследить прогресс можно в&nbsp;
        <CustomLink
          to="/collection?type=tickets"
          className="inline-flex items-center justify-center w-fit py-0.5 bg-shark-50 px-2 rounded-lg"
        >
          <span className="text-base text-shark-950 font-semibold">
            Тикеты
          </span>
        </CustomLink>
      </Typography>
    </div>
  )
}

const CreateTicket = reatomComponent(({ ctx }) => {
  const canCreateIssue = ctx.spy(userGlobalOptionsAtom).can_create_issue

  if (!canCreateIssue) {
    return <Prevent/>
  }

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <div className="flex bg-primary-color flex-col gap-4 rounded-lg w-full !p-4">
        <Typography textSize="big" textColor="shark_white">
          Сообщить о проблеме или идее
        </Typography>
      </div>
      <CreateIssueForm />
    </div>
  )
}, "CreateTicket")

export default function Page() {
  return <CreateTicket />
}