import { Button } from "@repo/ui/src/components/button"
import { Typography } from "@repo/ui/src/components/typography"
import { IconMoodWrrr } from "@tabler/icons-react"

type ErrorComponentProps = {
  error: Error
  reset: () => void
}

export const ErrorComponent = ({
  error, reset
}: ErrorComponentProps) => {
  return (
    <div className="flex overflow-hidden px-4 h-screen w-full items-center justify-center flex-col gap-12">
      <IconMoodWrrr size={64} className="text-red-500" />
      <div className="flex flex-col items-center justify-center gap-4">
        <Typography className="text-xl font-bold text-red-500">
          Произошла ошибка! Пожалуйста, перезагрузите страницу.
        </Typography>
        {(
          <pre className="w-fit bg-white/10 truncate rounded-lg px-4 py-1">
            <code>{error.message.slice(0, 64)}</code>
          </pre>
        )}
        <Button
          onClick={reset}
          className="py-1 px-4 rounded-lg bg-shark-50 gap-1"
        >
          <Typography textSize="big" className="font-semibold text-shark-900">
            Починить
          </Typography>
        </Button>
      </div>
    </div>
  )
}