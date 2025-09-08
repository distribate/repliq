import { AuthorizationButton } from "#shared/components/authorization-button"
import { Typography } from "@repo/ui/src/components/typography"

export const AuthTemplate = () => {
  return (
    <div className="flex flex-col bg-white/10 backdrop-blur-sm items-center gap-4 justify-center absolute z-[2] w-full h-full">
      <Typography className="text-[18px] font-bold text-center">
        Авторизуйтесь и станьте частью сообщества Repliq!
      </Typography>
    </div>
  )
}

export const AuthorizeTemplate = ({
  title
}: {
  title: string
}) => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full min-h-36 h-full">
      <Typography textSize="big" className='text-center font-semibold'>
        {title}
      </Typography>
      <AuthorizationButton />
    </div>
  )
}