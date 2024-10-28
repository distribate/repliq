import { Typography } from '@repo/ui/src/components/typography.tsx';
import { AdminSections } from '@repo/components/src/admin/components/navigation/admin-navigation-badge.tsx';
import { PageConventionProps } from '@repo/types/global';

export default async function AdminReportsPage({
	searchParams
}: PageConventionProps) {
	const section = searchParams.section as AdminSections;
	
	if (!section || section !== 'reports') return null;
	
	return (
		<div className="flex flex-col p-4 rounded-[12px] w-full h-full">
			<Typography textSize="very_big">
				Репорты
			</Typography>
			...
		</div>
	)
}