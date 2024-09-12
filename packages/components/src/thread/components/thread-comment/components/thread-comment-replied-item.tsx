import Link from "next/link";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { ThreadCommentProps } from "../types/thread-comment-types.ts";

export const ThreadRepliedCommentItem = ({
	replied
}: Pick<ThreadCommentProps, "replied">) => {
	if (!replied) return null;
	
	const repliedMessage = replied.content.length >= 28
		? replied.content.slice(0, 28) + '...' : replied.content
	
	return (
		<Link href={`#${replied.id}`} className="w-fit">
			<div className="flex items-center gap-1 cursor-pointer w-fit">
				<Separator className="w-[3px] !h-[42px]" orientation="vertical"/>
				<div className="flex flex-col bg-white/10 rounded-md min-w-[120px] overflow-hidden w-fit max-w-[300px] p-1 border border-shark-900">
					<Typography>
						{replied.user_nickname}
					</Typography>
					<Typography>
						{repliedMessage}
					</Typography>
				</div>
			</div>
		</Link>
	)
}