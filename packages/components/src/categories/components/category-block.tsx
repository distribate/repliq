import { ReactNode } from "react";
import { CategoryFilterArea } from "./category-filter-area.tsx";
import { CategoryContentArea } from "./category-content-area.tsx";
import Link from "next/link";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@repo/ui/src/components/accordion.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import Spyglass from "@repo/assets/images/minecraft/spyglass.webp"
import { ImageWrapper } from "../../wrappers/image-wrapper.tsx";
import { getThreadsCategories } from "@repo/lib/queries/get-threads-by-category.ts";
import { ThreadItem } from "../../thread/thread-item.tsx";

type CategoryBlockProps = {
	id: number,
	title: string
} & Partial<{
	filtration: ReactNode,
	content: ReactNode,
	description: string
}>

export const CategoryBlock = async({
	title, content, id, filtration, description, ...props
}: CategoryBlockProps) => {
	const threads = await getThreadsCategories({
		categoryId: id.toString(), limit: 3
	})
	
	return (
		<AccordionItem value={title}>
			<AccordionTrigger>
				<div className="flex items-center gap-2 px-2">
					<Typography textSize="very_big" textColor="shark_white" className="font-bold">
						{title}
					</Typography>
					<Link href={`/category/${id}`}>
						<ImageWrapper
							propSrc={Spyglass.src}
							propAlt={`перейти к категории ${title}`}
							width={20}
							height={20}
						/>
					</Link>
				</div>
			</AccordionTrigger>
			{threads ? (
				<AccordionContent>
					{filtration && (
						<CategoryFilterArea>
							{filtration}
						</CategoryFilterArea>
					)}
					<div className="flex flex-col gap-y-2 w-full">
						<p className="text-shark-400 text-md font-normal px-2">
							Темы:
						</p>
						<CategoryContentArea>
							{threads.map((thread, i) => (
								<ThreadItem key={i} id={thread.id}/>
							))}
						</CategoryContentArea>
					</div>
				</AccordionContent>
			) : (
				<div className="px-2 w-full">
					<Typography textSize="medium" className="text-shark-300">
						Тредов в этой категории ещё нет...
					</Typography>
				</div>
			)}
		</AccordionItem>
	)
}