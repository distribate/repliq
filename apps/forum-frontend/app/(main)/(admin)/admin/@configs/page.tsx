import { Typography } from "@repo/ui/src/components/typography.tsx";
import { AuthBackgroundImages } from "@repo/components/src/admin/components/configs/auth-background/components/auth-bg-images.tsx";
import { Alerts } from "@repo/components/src/admin/components/configs/alerts/components/alerts.tsx";
import { Ads } from "@repo/components/src/admin/components/configs/ads/components/ads.tsx";
import { AdminSections } from "@repo/components/src/admin/components/navigation/admin-navigation-badge.tsx";
import { MinecraftItemsList } from "@repo/components/src/admin/components/configs/minecraft-items/components/minecraft-items-list.tsx";
import { PageConventionProps } from "@repo/types/global";

export const dynamic = "force-dynamic";

export default async function AdminConfigsPage({
  searchParams,
}: PageConventionProps) {
  const section = searchParams.section as AdminSections;

  if (!section || section !== "configs") return null;

  return (
    <div className="flex flex-col gap-4 p-2 w-full h-full">
      <Typography className="p-2" textSize="very_big">
        Конфиги
      </Typography>
      <div className="flex flex-col gap-4">
        <div className="flex h-full w-full gap-4">
          <div className="flex flex-col bg-shark-900/60 relative p-4 rounded-md gap-4 w-fit h-fit">
            <Typography textSize="big">
              Фоновые изображения авторизации
            </Typography>
            <AuthBackgroundImages />
          </div>
          <div className="flex flex-col bg-shark-900/60 relative p-4 rounded-md gap-4 grow w-fit h-fit">
            <Typography textSize="big">Предметы</Typography>
            <MinecraftItemsList />
          </div>
        </div>
        <div className="flex h-full w-full gap-4">
          <div className="flex flex-col bg-shark-900/60 relative p-4 rounded-md gap-4 w-fit h-fit">
            <Typography textSize="big">Объявления</Typography>
            <Alerts />
          </div>
          <div className="flex flex-col bg-shark-900/60 relative p-4 rounded-md gap-4 w-fit h-fit">
            <Typography textSize="big">Рекламные объявления</Typography>
            <Ads />
          </div>
        </div>
      </div>
    </div>
  );
}
