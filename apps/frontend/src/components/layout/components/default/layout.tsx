import { PropsWithChildren } from "react"
import { Navbar } from "./navbar"
import { BottomBar } from "./bottombar"

export const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex w-full relative min-h-screen items-center py-2 justify-center overflow-hidden">
      <div className="flex flex-col gap-4 pb-14 sm:pb-0 responsive-width h-full items-center justify-start">
        <Navbar />
        <div id="content" className="flex gap-y-4 w-full h-full min-h-screen main-section">
          {children}
        </div>
        <BottomBar />
      </div>
    </div>
  )
}