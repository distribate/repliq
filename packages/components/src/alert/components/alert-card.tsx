import { ALERT } from "@repo/types/entities/entities-type.ts"
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { AlertClose } from "./alert-close.tsx";
import Link from "next/link";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import dayjs from "dayjs"

export const AlertCard = ({
	title, id, link, created_at
}: ALERT) => {
	return (
		<div
			id={title + id}
			className="flex flex-col gap-y-1 w-full rounded-md border-[1px] py-2 px-6 shadow-sm shadow-shark-900 border-white/10 bg-shark-950 relative"
		>
			<Typography textColor="shark_white" textSize="medium">
				{title}
			</Typography>
			{link && (
				<div className="flex items-center gap-2">
					<Link href={link}>
						<Typography textSize="small" className="text-pink-500">
							[ссылка]
						</Typography>
					</Link>
					<Separator orientation="vertical"/>
					<Typography textSize="small" className="text-shark-300">
						pureawake
					</Typography>
					<Separator orientation="vertical"/>
					<Typography textSize="small" className="text-shark-300">
						{dayjs(created_at).format(`DD.MM.YYYY HH:mm`)}
					</Typography>
				</div>
			)}
			<AlertClose/>
		</div>
	)
}