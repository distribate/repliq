import { Typography } from "@repo/ui/src/components/typography";
import Restricted from "@repo/assets/svgs/ban.svg"

export function RestrictRouteComponent() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full h-svh">
      <img src={Restricted} width={42} height={42} alt="" />
      <Typography textSize="big">
        You are temporarly restricted
      </Typography>
    </div>
  )
}