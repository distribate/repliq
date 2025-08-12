import { atom } from "@reatom/core"
import { usePageContext } from "vike-react/usePageContext"
import { reatomComponent, useUpdate } from "@reatom/npm-react"
import { Typography } from "@repo/ui/src/components/typography"
import { PropsWithChildren, ReactNode } from "react"
import { CustomLink } from "#components/shared/link"

export default function Page() {
  return (
    <>
      <Sync />
      <StudioPage />
    </>
  )
}

type StudioType = "threads" | ""

type StudioQuery = {
  type: StudioType, 
  target?: string
}

const studioQueryAtom = atom<StudioQuery>({ type: "", target: undefined }, "studioQuery")

const Sync = () => {
  const search = usePageContext().urlParsed.search;

  useUpdate((ctx) => {
    const { type, target } = search as StudioQuery;

    studioQueryAtom(ctx, { type, target })
  }, [search])

  return null;
}

const StudioNavigation = () => {
  const pathname = usePageContext().urlPathname
  const getLink = (target: StudioType) => `/studio?type=${target}`

  return (
    <div className="flex flex-col gap-4 bg-primary-color rounded-lg p-4 w-full md:w-1/4">
      <Typography textSize="very_big" className="font-semibold">
        Студия
      </Typography>
      <div className="flex flex-col gap-1 w-full *:duration-150 *:ease-in-out">
        <CustomLink
          to={getLink("")}
          data-state={pathname === "/studio" ? "active" : "inactive"}
          className="flex cursor-pointer items-center gap-2 group w-full 
              data-[state=active]:bg-shark-900 rounded-lg p-2"
        >
          <Typography className="font-semibold text-lg">
            Обзор
          </Typography>
        </CustomLink>
        <CustomLink
          to={getLink("threads")}
          data-state={pathname === "/studio?type=threads" ? "active" : "inactive"}
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

const StudioGlobal = reatomComponent(({ ctx }) => {
  return (
    <>
      Global
    </>
  )
}, "StudioGlobal")

const StudioThreads = reatomComponent(({ ctx }) => {
  const target = ctx.spy(studioQueryAtom).target;

  return (
    <>
      Threads {target}
    </>
  )
}, "StudioThreads")

const COMPONENTS: Record<StudioType, ReactNode> = {
  "": <StudioGlobal />,
  "threads": <StudioThreads />
}

const StudioContent = reatomComponent(({ ctx }) => {
  const type = ctx.spy(studioQueryAtom).type

  return COMPONENTS[type]
}, "StudioContent")

const StudioPage = reatomComponent<PropsWithChildren>(({ ctx, children }) => {
  return (
    <div className="flex flex-col md:flex-row items-start w-full gap-6 h-full">
      <StudioNavigation />
      <div className="flex w-full md:w-3/4 h-full">
        <StudioContent />
      </div>
    </div>
  )
}, "StudioPage")