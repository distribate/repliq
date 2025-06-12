import { lazy, Suspense, PropsWithChildren } from "react"
import { reatomComponent } from "@reatom/npm-react"
import { userGlobalOptionsAtom } from "#components/user/models/current-user.model"
import { isExperimentalDesignAtom } from "./experimental-layout.model"
import { Navbar } from "./navbar"
import { isAuthenticatedAtom } from "#components/auth/models/auth.model"

const SheetMenu = lazy(() => import("./mobile-sheet").then(m => ({ default: m.SheetMenu })))
const BottomBar = lazy(() => import("./mobile-sheet").then(m => ({ default: m.BottomBar })))
const DevPanel = lazy(() => import("../widgets/dev-panel").then(m => ({ default: m.DevPanel })))
const ExperimentalMainLayout = lazy(() => import("./experimental-layout").then(m => ({ default: m.ExperimentalMainLayout })))

export const MainLayout = reatomComponent<PropsWithChildren>(({ ctx, children }) => {
  return (
    <>
      {ctx.spy(isExperimentalDesignAtom) ? (
        <Suspense>
          <ExperimentalMainLayout>
            {children}
          </ExperimentalMainLayout>
        </Suspense>
      ) : (
        <div className="flex w-full relative min-h-screen items-center py-2 justify-center overflow-hidden">
          <div className="flex flex-col gap-4 responsive-width pb-[74px] h-full items-center justify-start">
            <Navbar />
            {ctx.spy(isAuthenticatedAtom) && (
              <>
                <Suspense>
                  <BottomBar />
                </Suspense>
                <Suspense>
                  <SheetMenu />
                </Suspense>
              </>
            )}
            <div id="main" className="flex gap-y-4 w-full h-full min-h-screen main-section">
              {children}
            </div>
          </div>
        </div>
      )}
      {ctx.spy(userGlobalOptionsAtom).is_admin && (
        <Suspense>
          <DevPanel />
        </Suspense>
      )}
    </>
  )
}, "MainLayout")