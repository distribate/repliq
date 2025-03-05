import { ReactNode } from "@tanstack/react-router"
import { Navbar } from "./navbar"

export const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex w-full relative min-h-screen items-center justify-center p-2 overflow-hidden">
      <div className="flex flex-col gap-2 w-full lg:w-[84%] h-full items-center justify-start">
        <Navbar />
        <div id="main" className="flex gap-y-4 w-full h-full min-h-screen main-section">
          {children}
        </div>
      </div>
    </div>
  )
}