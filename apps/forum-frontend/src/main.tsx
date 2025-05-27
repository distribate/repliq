import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { createCtx } from '@reatom/core'
import { connectLogger as logger } from '@reatom/framework'
import { reatomContext } from '@reatom/npm-react'
import { routeTree } from '#routes/__root'

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const reatomCtx = createCtx()

logger(reatomCtx)

export const router = createRouter({
  routeTree,
  context: { reatomCtx },
  defaultPreload: false,
  defaultPreloadStaleTime: 0
})

createRoot(document.getElementById('root')!).render(
  <reatomContext.Provider value={reatomCtx}>
    <RouterProvider router={router} />
  </reatomContext.Provider>
)