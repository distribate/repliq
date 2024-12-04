import { AdminSections } from "@repo/components/src/admin/components/navigation/admin-navigation-badge.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { PageConventionProps } from "@repo/types/global";
import { Metadata } from "next";

export default async function AdminStatsPage({
  searchParams,
}: PageConventionProps) {
  const section = searchParams.section as AdminSections;

  if (!section) return null;
  if (section !== "stats") return null;

  return (
    <div className="flex flex-col p-4 rounded-[12px] w-full h-full">
      <Typography textSize="very_big">Статистика</Typography>
      ...
    </div>
  );
}
