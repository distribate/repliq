import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { UserNickname } from "#components/user/components/name/nickname";
import { DeleteButton } from "@repo/ui/src/components/detele-button.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { AlertCircle, Link } from "lucide-react";
import { globalPreferencesAtom, updateVisibilityAction } from "#components/user/components/settings/main/models/update-global-preferences.model" 
import { CustomLink } from "#shared/components/link";
import { alertsResource } from "./alert-widget.model";
import { createIdLink } from "#lib/create-link";

const AlertClose = reatomComponent(({ ctx }) => {
  return <DeleteButton variant="invisible" onClick={() => updateVisibilityAction(ctx, "alerts")} />;
}, "AlertClose")

type AlertEntity = {
  id: number,
  link: string | null,
  creator: {
    nickname: string,
    avatar: string | null
  }
  created_at: string | Date,
  title: string,
  description: string | null
}

const AlertCard = ({
  title, creator, link
}: AlertEntity) => {
  return (
    <div
      className="flex flex-col md:flex-row md:gap-4 group md:items-center justify-center md:justify-between 
        w-full relative rounded-lg overflow-hidden gap-1 max-h-18 p-2 md:p-4 bg-primary-color"
    >
      <div className="flex items-center w-full gap-2">
        <AlertCircle size={20} className="text-shark-300 m-1" />
        <div className="flex flex-wrap items-center gap-2 text-[14px] md:text-[18px]">
          <Typography textColor="shark_white" className="truncate text-[14px] md:text-[18px]" >
            {title}
          </Typography>
          {link && (
            <a href={link} className="inline" target="_blank" rel="noreferrer">
              <Link size={18} className="text-green-500"/>
            </a>
          )}
        </div>
      </div>
      <div className="flex self-end md:self-auto items-center gap-2">
        <span className="text-[14px] md:text-[18px] text-shark-50">
          Автор:{' '}
        </span>
        <CustomLink to={createIdLink("user", creator.nickname)}>
          <UserNickname nickname={creator.nickname} className="text-[14px] md:text-[18px]" />
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