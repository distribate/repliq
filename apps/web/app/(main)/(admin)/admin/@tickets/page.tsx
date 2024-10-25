import { Typography } from '@repo/ui/src/components/typography.tsx';
import { PageConventionProps } from '@repo/types/config/page-types.ts';
import { AdminSections } from '@repo/components/src/admin/components/navigation/admin-navigation-badge.tsx';

export default async function AdminTicketsPage({
	searchParams
}: PageConventionProps) {
	const section = searchParams.section as AdminSections;
	
	if (!section) return null;
	if (section !== 'tickets') return null;
	
	return (
		<div className="flex flex-col p-4 rounded-[12px] w-full h-full">
			<Typography textSize="very_big">
				Тикеты
			</Typography>
			...
		</div>
	)
}