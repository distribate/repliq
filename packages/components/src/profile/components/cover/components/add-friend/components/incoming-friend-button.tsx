import { Select, SelectContent, SelectItem, SelectTrigger } from "@repo/ui/src/components/select.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Plus, Minus } from 'lucide-react';

export const IncomingFriendButton = () => {
	return (
		<Select>
			<SelectTrigger className="hover:bg-pink-700 bg-pink-600 overflow-hidden">
				Хочет добавить вас в друзья
			</SelectTrigger>
			<SelectContent className="flex flex-col gap-y-1">
				<div className="flex flex-row gap-2 items-center hover:bg-shark-900 group rounded-md px-2 py-0.5">
					<Plus size={18} className="text-shark-50 group-hover:text-emerald-500"/>
					<Typography>
						Принять заявку
					</Typography>
				</div>
				<div className="flex flex-row gap-2 items-center hover:bg-shark-900 rounded-md group px-2 py-0.5">
					<Minus size={18} className="text-shark-50 group-hover:text-red-500"/>
					<Typography>
						Отклонить заявку
					</Typography>
				</div>
			</SelectContent>
		</Select>
	)
}