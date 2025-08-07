import { CustomLink } from '#components/shared/link'
import { Button } from '@repo/ui/src/components/button'
import { Typography } from '@repo/ui/src/components/typography'
import { IconDeviceDesktopPause } from '@tabler/icons-react'
import { usePageContext } from 'vike-react/usePageContext'

export default function ErrorPage() {
  const { abortReason, is404, abortStatusCode } = usePageContext()
  const isNotFound = is404 || abortStatusCode === 404

  let msg: string

  if (typeof abortReason === 'string') {
    msg = abortReason
  } else {
    msg = isNotFound ?
      "Данный ресурс не был найден" :
      "Что-то пошло не так"
  }

  return (
    <div className="flex flex-col gap-4 h-screen items-center justify-center w-full">
      <p className="text-2xl text-shark-50 font-semibold">
        {msg}
      </p>
      <div className="flex rounded-lg bg-shark-700 items-center justify-center p-4">
        <IconDeviceDesktopPause size={64} className="text-shark-300" />
      </div>
      <CustomLink to="/home">
        <Button className="bg-shark-50">
          <Typography className="text-shark-950 font-semibold text-lg">
            Вернуться на главную
          </Typography>
        </Button>
      </CustomLink>
    </div>
  )
}