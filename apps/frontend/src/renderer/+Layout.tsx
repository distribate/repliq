import { PropsWithChildren, ReactNode } from 'react';
import { Notifications } from '#components/notifications/components/notifications-wrapper';
import { Toaster } from '#shared/components/toast';
import { AtomState, Ctx, connectLogger as logger } from '@reatom/framework'
import { reatomContext, useUpdate } from '@reatom/npm-react'
import { isSsr, useCreateCtx } from "#lib/reatom";
import { usePageContext } from "vike-react/usePageContext";
import { snapshotAtom } from "#lib/ssr";
import { pageContextAtom } from "#lib/sync";

const SyncPageContext = () => {
  const pageContext = usePageContext();
  useUpdate((ctx) => pageContextAtom(ctx, pageContext), [pageContext])
  return null;
}

function initSnapshot(
  ctx: Ctx, 
  snapshot: AtomState<typeof snapshotAtom>
) {
  snapshotAtom(ctx, snapshot);

  if (isSsr && import.meta.env.DEV) {
    logger(ctx)
  }
}

const ReatomProvider = ({ children }: { children: ReactNode }) => {
  const { snapshot } = usePageContext();

  const ctx = useCreateCtx((ctx) => initSnapshot(ctx, snapshot))

  return (
    <reatomContext.Provider value={ctx}>
      <SyncPageContext />
      {children}
    </reatomContext.Provider>
  )
}

export default function Layout({ children }: PropsWithChildren) {
  return (
    <ReatomProvider>
      <Toaster />
      <Notifications />
      {children}
    </ReatomProvider>
  )
}