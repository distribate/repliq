import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const NavigationBar = () => {
	const { back, forward } = useRouter();

	return (
		<div className="flex flex-wrap items-center gap-2 *:flex *:rounded-md *:p-1 *:items-center *:justify-center *:overflow-hidden *:backdrop-filter *:cursor-pointer">
			<div onClick={() => back()} className="group hover:bg-black/30">
				<ChevronLeft size={18} className="group-hover:text-shark-50 text-shark-300"/>
			</div>
			<div onClick={() => forward()} className="group hover:bg-black/30">
				<ChevronRight size={18} className="group-hover:text-shark-50 text-shark-300"/>
			</div>
		</div>
	)
}