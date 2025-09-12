import { BottomBar } from "#components/layout/bottombar/bottombar";
import { Navbar } from "#components/layout/navbar/navbar";
import { withSsr } from "#shared/lib/ssr";
import { action, atom } from "@reatom/core";
import { sleep } from "@reatom/framework";
import { reatomComponent, useUpdate } from "@reatom/npm-react";
import { PropsWithChildren } from "react";

import "../../editor.css"

const appIsInitAtom = atom(false, 'appIsInitAtom').pipe(
  withSsr("appIsInitAtom")
)

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex w-full relative min-h-screen items-center py-2 justify-center overflow-hidden animate-fade-in">
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

const exec = action(async (ctx) => {
  await ctx.schedule(() => sleep(600))
  appIsInitAtom(ctx, true)
}, "exec")

const Sync = () => {
  useUpdate((ctx) => exec(ctx), [])
  return null;
}

const SplashScreen = () => {
  return (
    <div className="fullscreen-section">
      <img
        src="/logotype.webp"
        alt="Repliq"
        fetchPriority="high"
        className="min-w-42 min-h-42 max-w-64 max-h-64 aspect-square animate-heartbeat-then-fade"
      />
    </div>
  )
}

const MainWrapper = reatomComponent<PropsWithChildren>(({ ctx, children }) => {
  if (!ctx.spy(appIsInitAtom)) return <SplashScreen />

  return (
    <MainLayout>
      {children}
    </MainLayout>
  )
}, "MainWrapper")

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Sync />
      <MainWrapper>
        {children}
      </MainWrapper>
    </>
  )
}