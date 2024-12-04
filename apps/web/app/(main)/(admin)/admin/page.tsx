import { Dashboard } from "@repo/components/src/admin/components/dashboard/components/dashboard.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { AdminSections } from "@repo/components/src/admin/components/navigation/admin-navigation-badge.tsx";
import { PageConventionProps } from "@repo/types/global";

export default async function AdminControlPage({
  searchParams,
}: PageConventionProps) {
  const section = searchParams.section as AdminSections;

  if (section && section !== "main") {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 p-2 w-full h-full">
      <Typography className="p-2" textSize="very_big">
        Дашборд
      </Typography>
      <Dashboard />
    </div>
  );
}
