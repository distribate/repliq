import { usePageContext } from "vike-react/usePageContext"
import { Typography } from "@repo/ui/src/components/typography"
import { PropsWithChildren } from "react"
import { CustomLink } from "#shared/components/link"

export default function StudioLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col md:flex-row items-start w-full gap-6 h-full">
      <StudioNavigation />
      <div className="flex w-full md:w-3/4 h-full">
        {children}
      </div>
    </div>
  )
}

const StudioNavigation = () => {
  const pathname = usePageContext().urlPathname

  return (
    <div className="flex flex-col gap-4 bg-primary-color rounded-lg p-4 w-full md:w-1/4">
      <Typography textSize="very_big" className="font-semibold">
        Студия
      </Typography>
      <div className="flex flex-col gap-1 w-full *:duration-150 *:ease-in-out">
        <CustomLink
          to="/studio"
          data-state={pathname === "/studio" ? "active" : "inactive"}
          className="flex cursor-pointer items-center gap-2 group w-full 
              data-[state=active]:bg-shark-900 rounded-lg p-2"
        >
          <Typography className="font-semibold text-lg">
            Обзор
          </Typography>
        </CustomLink>
        <CustomLink
          to="/studio/threads"
          data-state={pathname === "/studio/threads" ? "active" : "inactive"}
          className="flex cursor-pointer items-center gap-2 group w-full 
              data-[state=active]:bg-shark-900 rounded-lg p-2"
        >
          <Typography className="font-semibold text-lg">
            Треды
          </Typography>
        </CustomLink>
      </div>
    </div>
  )
}