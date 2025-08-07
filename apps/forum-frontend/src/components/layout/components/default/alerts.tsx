import { reatomComponent } from "@reatom/npm-react";
import { globalPreferencesAtom } from "#components/user/settings/main/models/update-global-preferences.model";
import { isAuthenticatedAtom } from "#components/auth/models/auth.model";
import { clientOnly } from "vike-react/clientOnly";

const AlertWidget = clientOnly(() => import('#components/layout/components/widgets/alert/alert-widget').then((m) => m.AlertWidget))

export const Alerts = reatomComponent(({ ctx }) => {
  if (!ctx.spy(isAuthenticatedAtom)) return null;

  return (
    ctx.spy(globalPreferencesAtom).alerts === 'show' && (
      <div className="flex flex-col gap-2 w-full">
        <AlertWidget />
      </div>
    )
  )
}, "Alerts")