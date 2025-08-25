import { PropsWithChildren } from "react"
import { reatomComponent } from "@reatom/npm-react"
import { userGlobalOptionsAtom } from "#components/user/models/current-user.model"
import { BottomBar, Navbar } from "./navbar"
import { Footer } from "./footer"

export const MainLayout = reatomComponent<PropsWithChildren>(({ ctx, children }) => {
  return (
    <>
      <div className="flex w-full relative min-h-screen items-center py-2 justify-center overflow-hidden">
        <div className="flex flex-col gap-4 pb-14 sm:pb-0 responsive-width h-full items-center justify-start">
          <Navbar />
          <div id="content" className="flex gap-y-4 w-full h-full min-h-screen main-section">
            {children}
          </div>
          <BottomBar />
        </div>
      </div>
    </>
  )
}, "MainLayout")