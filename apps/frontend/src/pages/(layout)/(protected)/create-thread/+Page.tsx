import { Typography } from '@repo/ui/src/components/typography.tsx'
import { reatomComponent } from '@reatom/npm-react'
import { userGlobalOptionsAtom } from '#components/user/models/current-user.model'
import { CreateThreadForm } from '#components/thread/components/thread-create/components/form-thread'
import { IconX } from '@tabler/icons-react'
import { Button } from '@repo/ui/src/components/button'

const Prevent = () => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full md:h-[80dvh]">
      <IconX size={128} className="text-red-500" />
      <Typography className="text-2xl text-center font-semibold w-full lg:w-[60%]">
        Превышен лимит созданных тредов за сегодня
      </Typography>
      <Button
        onClick={() => window.history.back()}
        className="inline-flex items-center justify-center w-fit py-0.5 bg-shark-50 px-2 rounded-lg"
      >
        <span className="text-base text-shark-950 font-semibold">
          Вернуться
        </span>
      </Button>
    </div>
  )
}

const CreateThread = reatomComponent(({ ctx }) => {
  const canCreateThreads = ctx.spy(userGlobalOptionsAtom).can_create_threads

  if (!canCreateThreads) {
    return <Prevent />
  }

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <CreateThreadForm />
    </div>
  )
}, "CreateThread")

export default function Page() {
  return <CreateThread />
}