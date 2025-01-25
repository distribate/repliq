import { Avatar } from "../../../../../user/components/avatar/components/avatar.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import dayjs from "dayjs";
import { AlertItemEditButton } from "./alert-item-edit-button.tsx";
import { AlertItemDeleteButton } from "./alert-item-delete-button.tsx";
import { AlertsAddButton } from "./alerts-add-button.tsx";
import { alertsQuery } from "@repo/lib/queries/alerts-query.ts";

export const Alerts = () => {
  const { data } = alertsQuery({ limit: 1 });

  const alerts = data?.data;

  return (
    alerts && (
      <>
        <div className="flex flex-col gap-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex h-14 bg-shark-900 rounded-md p-2 justify-between items-center"
            >
              <div className="flex items-center gap-2">
                <Avatar
                  nickname={alert.creator}
                  propWidth={36}
                  propHeight={36}
                />
                <div className="flex flex-col">
                  <Typography>{alert.title.slice(0, 64)}</Typography>
                  <Typography textSize="small" className="text-shark-300">
                    опубликовано{" "}
                    {dayjs(alert.created_at).format("HH:mm:ss DD.MM.YYYY")}
                  </Typography>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-8">
                <AlertItemEditButton {...alert} />
                <AlertItemDeleteButton id={alert.id} />
              </div>
            </div>
          ))}
          <AlertsAddButton />
        </div>
      </>
    )
  );
};