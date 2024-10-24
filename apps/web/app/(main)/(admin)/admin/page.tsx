import { Dashboard } from '@repo/components/src/admin/components/dashboard/components/dashboard.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { PageConventionProps } from '@repo/types/config/page-types.ts';

export default async function AdminControlPage({
	searchParams
}: PageConventionProps) {
	const { section } = searchParams;
	
	if (
		(section === 'reports') || (section === 'configs') || (section === 'tickets')
	) return null;
	
	return (
		<div className="flex flex-col gap-4 p-2 w-full h-full">
			<Typography className="p-2" textSize="very_big">
				Дашборд
			</Typography>
			<Dashboard />
		</div>
	)
}