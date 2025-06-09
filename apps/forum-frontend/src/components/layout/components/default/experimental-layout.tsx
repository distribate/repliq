import { reatomComponent } from "@reatom/npm-react"
import { currentUserNicknameAtom } from "@repo/lib/helpers/get-user"
import { useLocation } from "@tanstack/react-router"
import { lazy, PropsWithChildren, Suspense } from "react"
import { Home, User2, UsersRound } from "lucide-react"
import { CustomLink } from "#components/shared/link"
import { Typography } from "@repo/ui/src/components/typography"
import { Separator } from "@repo/ui/src/components/separator"
import { Navbar } from "./navbar"
import { createIdLink } from "@repo/lib/utils/create-link"

const BottomBar = lazy(() => import("./mobile-sheet").then(m => ({ default: m.BottomBar })))
const SheetMenu = lazy(() => import("./mobile-sheet").then(m => ({ default: m.SheetMenu })))

const _SIDE = (nickname: string) => [
  { title: "Главная", icon: Home, href: "/", },
  { title: "Профиль", icon: User2, href: createIdLink("user", nickname) },
  { title: "Друзья", icon: UsersRound, href: "/friends", },
]

const Side = reatomComponent(({ ctx }) => {
  const loc = useLocation()
  const path = loc.pathname + loc.searchStr

  return (
    _SIDE(ctx.spy(currentUserNicknameAtom)!).map((i, idx) => (
      <>
        <CustomLink
          key={idx}
          to={i.href}
          data-state={path === i.href ? "active" : "inactive"}
          className="flex bg-shark-950/60
          hover:bg-shark-900/60 py-2 px-3 rounded-lg items-center justify-start gap-2 group w-full 
            border-2 data-[state=inactive]:border-transparent data-[state=active]:border-biloba-flower-500/60"
        >
          <i.icon size={22} className="text-biloba-flower-300" />
          <Typography textSize="medium" className="font-semibold">
            {i.title}
          </Typography>
        </CustomLink>
        {idx === 3 && <Separator />}
      </>
    ))
  )
}, "Side")

export const ExperimentalMainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex w-full relative min-h-screen items-center pt-4 pb-[80px] md:py-4 justify-center overflow-hidden">
      <div className="flex flex-col gap-4 responsive-width h-full items-center justify-start">
        <Navbar />
        <Suspense>
          <BottomBar />
        </Suspense>
        <Suspense>
          <SheetMenu />
        </Suspense>
        <div id="main" className="flex gap-2 w-full h-full min-h-screen main-section">
          <div className="hidden sm:flex flex-col gap-2 w-1/6 sticky top-0">
            <Side />
          </div>
          <div className="w-full sm:w-5/6 h-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}