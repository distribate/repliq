import { AlertEntity } from "@repo/types/entities/entities-type.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Link } from "@tanstack/react-router";
import { Suspense } from "react";
import { USER_URL } from "@repo/shared/constants/routes";
import { Skeleton } from "@repo/ui/src/components/skeleton";
import { Avatar } from "#components/user/avatar/components/avatar";
import { UserNickname } from "#components/user/name/components/nickname";
import { DeleteButton } from "@repo/ui/src/components/detele-button.tsx";
import { useUpdateGlobalPreferences } from "@repo/lib/hooks/use-update-global-preferences";
import { alertsQuery } from "@repo/lib/queries/alerts-query";
import { globalPreferencesQuery } from "@repo/lib/queries/global-preferences-query";

const AlertClose = () => {
  const { updateShowingMutation } = useUpdateGlobalPreferences()

  return <DeleteButton variant="invisible" onClick={() => updateShowingMutation.mutate("alerts")} />;
};

const AlertCard = ({
  title, id, creator, link, created_at,
}: AlertEntity) => {
  return (
    <div className="flex group select-none gap-4 items-center w-full relative rounded-lg min-h-12 max-h-32 px-4 bg-primary-color">
      <Typography
        textColor="shark_white"
        textSize="medium"
        className="font-[Minecraft]"
      >
        {title} {link && <Link to={link} target="_blank" rel="noopener noreferrer">
          <span className="text-[18px] text-green-500">
            (ссылка)
          </span>
        </Link>}
      </Typography>
      <span className="font-[Minecraft] text-[12px] text-shark-50">
        ⏺
      </span>
      <div className="flex items-center gap-2">
        <Suspense fallback={<Skeleton className="h-[16px] w-[16px]" />}>
          <Link to={USER_URL + creator}>
            <Avatar nickname={creator} propWidth={16} propHeight={16} />
          </Link>
        </Suspense>
        <Link to={USER_URL + creator}>
          <UserNickname nickname={creator} className="text-[14px]" />
        </Link>
      </div>
      <AlertClose />
    </div>
  );
};

export const AlertWidget = () => {
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