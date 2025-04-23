import { PageWrapper } from "#components/wrappers/components/page-wrapper"
import { isProduction } from "@repo/lib/helpers/is-production"
import { Typography } from "@repo/ui/src/components/typography"
import HardcodeHeart from "@repo/assets/gifs/hardcore-heart-minecraft.gif"

type ErrorComponentProps = {
  error: Error
  reset: () => void
}

export const ErrorComponent = ({
  error, reset
}: ErrorComponentProps) => {
  return (
    <PageWrapper className="flex flex-col gap-12">
      <img src={HardcodeHeart} alt="" width={144} height={144} className="max-w-1/3 max-h-1/3" />
      <div className="flex flex-col items-center justify-center gap-4">
        <Typography className="text-xl font-[Minecraft] text-white">
          Произошла ошибка! Пожалуйста, перезагрузите страницу.
        </Typography>
        {!isProduction && (
          <pre className="w-fit bg-shark-800 truncate rounded-lg px-2 py-1">
            <code>{error.message.slice(0, 256)}</code>
          </pre>
        )}
        <div
          onClick={reset}
          className="flex py-1 px-4 rounded-lg bg-shark-50 cursor-pointer items-center gap-1 justify-between"
        >
          <Typography className="text-[18px] font-semibold font-[Minecraft] text-shark-900">
            Починить
          </Typography>
        </div>
      </div>
    </PageWrapper>
  )
}