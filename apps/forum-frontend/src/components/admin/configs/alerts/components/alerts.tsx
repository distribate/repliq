import { Avatar } from "#components/user/avatar/components/avatar.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import dayjs from "dayjs";
import { AlertItemEditButton } from "./alert-item-edit-button.tsx";
import { AlertsAddButton } from "./alerts-add-button.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { DeleteButton } from "@repo/ui/src/components/detele-button.tsx";
import { AlertEntity } from "@repo/types/entities/entities-type.ts";
import { alertsResource } from "@repo/lib/queries/alerts.model";

const AlertItemDeleteButton = ({ id }: Pick<AlertEntity, "id">) => {
  return <DeleteButton title="Удалить" disabled={false} onClick={() => {}} />;
};

export const Alerts = reatomComponent(({ ctx }) => {
  const alert = ctx.spy(alertsResource.dataAtom)?.data[0];

  if (!alert) return null;

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex h-14 bg-shark-900 rounded-md p-2 justify-between items-center">
          <div className="flex items-center gap-2">
            <Avatar nickname={alert.creator} propWidth={36} propHeight={36} />
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
        <AlertsAddButton />
      </div>
    </>
  );
}, "Alerts");
