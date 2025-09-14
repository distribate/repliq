import { PropsWithChildren, ReactNode } from 'react';
import { Toaster } from '#shared/components/toast';
import { AtomState, Ctx, connectLogger as logger } from '@reatom/framework'
import { reatomContext, useUpdate } from '@reatom/npm-react'
import { isSsr, useCreateCtx } from "#shared/lib/reatom";
import { usePageContext } from "vike-react/usePageContext";
import { snapshotAtom } from "#shared/lib/ssr";
import { pageContextAtom } from "#shared/lib/context-sync";
import { connectNotificationsAction } from "#shared/models/notifications.model";
import { isDevelopment } from '#shared/env';
import { ErrorBoundary } from '#shared/components/error-boundary';

import '../global.css';

const SyncPageContext = () => {
  const pageContext = usePageContext();
  useUpdate((ctx) => pageContextAtom(ctx, pageContext), [pageContext])
  return null;
}

async function initDevtools(ctx: Ctx) {
  const { createDevtools } = await import('@reatom/devtools')
  globalThis.DEVTOOLS = createDevtools({ ctx })
}

function init(ctx: Ctx, snapshot: AtomState<typeof snapshotAtom>) {
  snapshotAtom(ctx, snapshot);

  if (isDevelopment) {
    if (!isSsr) {
      logger(ctx)
      initDevtools(ctx);
    }
  }
}

const ReatomProvider = ({ children }: { children: ReactNode }) => {
  const { snapshot } = usePageContext();

  const ctx = useCreateCtx((ctx) => init(ctx, snapshot))

  return (
    <reatomContext.Provider value={ctx}>
      <SyncPageContext />
      {children}
    </reatomContext.Provider>
  )
}

const Notifications = () => {
  useUpdate(connectNotificationsAction, [])
  return null;
}

export default function Layout({ children }: PropsWithChildren) {
  return (
    <ReatomProvider>
      <ErrorBoundary>
        <Toaster />
        <Notifications />
        {children}
      </ErrorBoundary>
    </ReatomProvider>
  )
}