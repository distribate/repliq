import { AuthorizationButton } from "#components/layout/components/default/authorization-button"
import { Typography } from "@repo/ui/src/components/typography"

export const AuthTemplate = () => {
  return (
    <div className="flex flex-col bg-white/10 backdrop-blur-sm items-center gap-4 justify-center absolute z-[2] w-full h-full">
      <Typography className="text-[18px] font-bold text-center">
        Авторизуйтесь и станьте частью сообщества Fasberry!
      </Typography>
    </div>
  )
}

export const AuthorizeTemplate = () => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full min-h-36 h-full">
      <Typography textSize="big" className='text-center font-semibold'>
        Для просмотра профиля необходимо авторизоваться.
      </Typography>
      <AuthorizationButton />
    </div>
  )
}