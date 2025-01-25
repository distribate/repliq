import { alertsQuery } from "@repo/lib/queries/alerts-query";
import { AlertCard } from "./alert-card";

export const Alerts = () => {
  const { data } = alertsQuery({
    limit: 1
  })

  const alerts = data?.data

  if (!alerts) return null;

  return (
    <div className="flex flex-col gap-2 w-full">
      {alerts.map(alert => <AlertCard key={alert.id} {...alert} />)}
    </div>
  );
};