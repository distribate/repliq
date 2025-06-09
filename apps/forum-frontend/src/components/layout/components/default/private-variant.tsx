import { reatomComponent } from "@reatom/npm-react"
import { MainLayout } from "./layout"
import { MainCategories } from "#components/categories/components/main/components/main-categories-list"
import { MainNavigation } from "./main-navigation"
import { StatusWidget } from "../widgets/status-widget"
import { Footer } from "./footer"
import { LatestComments } from "./latest-comments"
import { LatestNews } from "../stats/latest-news"
import { isExperimentalDesignAtom } from "./experimental-layout.model"
import { Alerts } from "./alerts"

export const PrivateVariant = reatomComponent(({ ctx }) => {
  return (
    <MainLayout>
      <main className="flex flex-col w-full gap-2 h-full">
        <Alerts />
        <div className="flex xl:flex-row gap-2 flex-col w-full h-full">
          <div data-state={ctx.spy(isExperimentalDesignAtom)} className="flex flex-col w-full data-[state=false]:xl:w-3/4 gap-2 h-full">
            <StatusWidget />
            <MainNavigation />
            <MainCategories />
            <Footer />
          </div>
          {!ctx.spy(isExperimentalDesignAtom) && (
            <div className="flex flex-col gap-2 w-full xl:w-1/4 h-full">
              <LatestComments />
              <LatestNews />
            </div>
          )}
        </div>
      </main>
    </MainLayout>
  )
}, "PrivateVariant")