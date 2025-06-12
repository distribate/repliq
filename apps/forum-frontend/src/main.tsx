// @ts-expect-error
import "./global.css"

import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { createCtx } from '@reatom/core'
import { connectLogger as logger } from '@reatom/framework'
import { reatomContext } from '@reatom/npm-react'
import { routeTree } from '#routes/root'
import { BProgress } from '@bprogress/core';
import { createHead, UnheadProvider } from '@unhead/react/client'

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const reatomCtx = createCtx()

function connectReatomLogger() {
  if (import.meta.env.DEV) {
    logger(reatomCtx)
  }
}

connectReatomLogger()

export const router = createRouter({
  routeTree,
  context: { reatomCtx },
  defaultPreload: false,
  defaultPreloadStaleTime: 0
})

router.subscribe('onBeforeLoad', () => BProgress.start())
router.subscribe('onLoad', () => BProgress.done())

const head = createHead({
  init: [
    { htmlAttrs: { lang: 'ru' } }
  ]
})

createRoot(document.getElementById('root')!).render(
  <reatomContext.Provider value={reatomCtx}>
    <UnheadProvider head={head}>
      <RouterProvider router={router} />
    </UnheadProvider>
  </reatomContext.Provider>
)