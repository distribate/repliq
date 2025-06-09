import { reatomComponent } from "@reatom/npm-react";
import { isAuthenticatedAtom } from "@repo/lib/queries/global-option-query";
import { lazy, Suspense } from "react";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { globalPreferencesAtom } from "@repo/lib/queries/global-preferences.model";

const AlertWidget = lazy(() => import('#components/layout/components/widgets/alert-widget').then((m) => ({ default: m.AlertWidget })))

export const Alerts = reatomComponent(({ ctx }) => {
  if (!ctx.spy(isAuthenticatedAtom)) return null;

  return (
    ctx.spy(globalPreferencesAtom).alerts === 'show' && (
      <Suspense fallback={<Skeleton className="w-full h-28" />}>
        <div className="flex flex-col gap-2 w-full">
          <AlertWidget />
        </div>
      </Suspense>
    )
  )
}, "Alerts")