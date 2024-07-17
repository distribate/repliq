import { Button } from "@repo/ui/src/components/button.tsx";
import { Pencil } from 'lucide-react';
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { useRouter } from "next/navigation";
import { useSidebarControl } from '../../sidebar-layout/hooks/use-sidebar-control.ts';

export const CreateThread = () => {
	const { replace } = useRouter();
	const { isCompact, isExpanded } = useSidebarControl()
	
	return (
		<div className="w-full">
			{isCompact || !isExpanded ? (
				<div className="flex w-[50px] h-[50px]">
					<Button className="group gap-2 w-full justify-start" onClick={() => { replace("/create-thread") }}>
						<Pencil size={18} className="group-hover:text-pink-500 text-shark-300"/>
					</Button>
				</div>
			) : (
				<div className="flex w-full">
					<Button onClick={() => { replace("/create-thread") }} className="group gap-2 w-full justify-start">
						<Pencil size={18} className="group-hover:text-pink-500 text-shark-300"/>
						<Typography textSize="small">Создать тред</Typography>
					</Button>
				</div>
			)}
		</div>
	)
}