import { Typography } from "@repo/ui/src/components/typography";
import Pointer from "@repo/assets/svgs/pointer-code.svg"

export function DevelopmentRouteComponent() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full h-svh">
      <img src={Pointer} width={42} height={42} alt="" />
      <Typography textSize="big">
        API in development
      </Typography>
    </div>
  )
}