import { PropsWithChildren } from "react"
import { reatomComponent } from "@reatom/npm-react"
import { userGlobalOptionsAtom } from "#components/user/models/current-user.model"
import { Navbar } from "./navbar"
import { Footer } from "./footer"
import { clientOnly } from "vike-react/clientOnly"

const DevPanel = clientOnly(() => import("../widgets/dev-panel").then(m => m.DevPanel))

export const MainLayout = reatomComponent<PropsWithChildren>(({ ctx, children }) => {
  return (
    <>
      <div className="flex w-full relative min-h-screen items-center py-2 justify-center overflow-hidden">
        <div className="flex flex-col gap-4 responsive-width pb-[74px] md:pb-0 h-full items-center justify-start">
          <Navbar />
          <div id="main" className="flex gap-y-4 w-full h-full min-h-screen main-section">
            {children}
          </div>
          <Footer />
        </div>
      </div>
      {ctx.spy(userGlobalOptionsAtom).is_admin && <DevPanel />}
    </>
  )
}, "MainLayout")