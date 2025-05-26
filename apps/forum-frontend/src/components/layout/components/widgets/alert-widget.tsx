import { AlertEntity } from "@repo/types/entities/entities-type.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { USER_URL } from "@repo/shared/constants/routes";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { UserNickname } from "#components/user/name/nickname";
import { DeleteButton } from "@repo/ui/src/components/detele-button.tsx";
import { globalPreferencesAtom } from "@repo/lib/queries/global-preferences-query";
import { reatomComponent } from "@reatom/npm-react";
import { AlertCircle } from "lucide-react";
import { updateVisibilityAction } from "@repo/lib/hooks/update-global-preferences.model" 
import { CustomLink } from "#components/shared/link";
import { alertsResource } from "./alert-widget.model";

const AlertClose = reatomComponent(({ ctx }) => {
  return <DeleteButton variant="invisible" onClick={() => updateVisibilityAction(ctx, "alerts")} />;
}, "AlertClose")

const AlertCard = ({
  title, creator, link
}: AlertEntity) => {
  return (
    <div
      className="flex flex-col md:flex-row md:gap-4 md:items-center justify-center md:justify-between 
        w-full relative rounded-lg overflow-hidden gap-1 max-h-18 p-2 md:p-4 bg-primary-color font-[Minecraft]"
    >
      <div className="flex items-center w-full gap-2">
        <AlertCircle size={20} className="text-shark-300 m-1" />
        <div className="flex flex-wrap gap-1 text-[14px] md:text-[18px]">
          <Typography textColor="shark_white" className="truncate text-[14px] md:text-[18px]" >
            {title}
          </Typography>
          {link && (
            <a href={link} className="inline" target="_blank" rel="noopener noreferrer">
              <span className="text-green-500">
                (ссылка)
              </span>
            </a>
          )}
        </div>
      </div>
      <div className="flex self-end md:self-auto items-center gap-2">
        <span className="text-[14px] text-shark-50">
          Автор:{' '}
        </span>
        <CustomLink to={USER_URL + creator}>
          <UserNickname nickname={creator} className="text-[14px]" />
        </CustomLink>
      </div>
      <AlertClose />
    </div>
  );
};

const Alert = reatomComponent(({ ctx }) => {
  if (ctx.spy(alertsResource.statusesAtom).isPending) return <Skeleton className="w-full h-28" />

  const alert = ctx.spy(alertsResource.dataAtom)?.data[0]

  if (!alert) return null;

  return <AlertCard {...alert} />
}, "Alert")

export const AlertWidget = reatomComponent(({ ctx }) => {
  const { alerts: alertsShowing } = ctx.spy(globalPreferencesAtom)

  if (alertsShowing === 'hide') return null;

  return <Alert />
}, "AlertWidget")