import { Typography } from '@repo/ui/src/components/typography.tsx';
import { PageConventionProps } from '@repo/types/config/page-types.ts';

export default async function AdminReportsPage({
	searchParams
}: PageConventionProps) {
	const { section } = searchParams;
	
	if (!section) return null;
	
	if (section !== 'reports') return null;
	
	return (
		<div className="flex flex-col p-4 rounded-[12px] w-full h-full">
			<Typography textSize="very_big">
				Репорты
			</Typography>
			...
		</div>
	)
}