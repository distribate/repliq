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