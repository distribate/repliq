import { alertsQuery } from "@repo/lib/queries/alerts-query";
import { AlertCard } from "./alert-card";
import { globalPreferencesQuery } from "@repo/lib/queries/global-preferences-query";

export const Alerts = () => {
  const { data: { alerts: alertsShowing } } = globalPreferencesQuery()
  const { data } = alertsQuery({ limit: 1, enabled: alertsShowing === 'show' });

  if (alertsShowing === 'hide') return null;

  const alerts = data?.data

  if (!alerts) return null;

  return (
    <div className="flex flex-col gap-2 w-full">
      {alerts.map(alert => <AlertCard key={alert.id} {...alert} />)}
    </div>
  );
};