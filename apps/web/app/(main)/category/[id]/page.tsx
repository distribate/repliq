import { MetadataType, PageConventionProps } from "@repo/types/config/page-types.ts"
import { notFound, redirect } from "next/navigation";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { getThreadsCategories } from "@repo/lib/queries/get-threads-by-category.ts";
import { Metadata } from "next";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { getCategory } from '@repo/lib/queries/get-category.ts';

export async function generateMetadata({
	params
}: MetadataType): Promise<Metadata> {
	const { id } = params;
	
	let title: string;
	
	if (!id) title = "...";
	
	const category = await getCategory({
		category_id: id
	});
	
	title = category.title
	
	return {
		title: title
	}
}

export default async function CategoryByIdPage({
	params
}: PageConventionProps) {
	const { id } = params;
	
	if (!id) redirect("/");
	
	const category = await getCategory({
		category_id: id
	})
	
	const threads = await getThreadsCategories({
		categoryId: id, limit: 50
	})
	
	if (!category) return notFound()
	
	if (!threads) return <Typography>Ничего не нашлось...</Typography>;
	
	return (
		<div className="flex flex-col w-full gap-y-4">
			<div className="flex flex-col w-full">
				<div className="flex items-center gap-2">
					<Typography>{category.title}</Typography>
					{category.description && (
						<>
							<Separator orientation="vertical"/>
							<Typography>{category.description}</Typography>
						</>
					)}
				</div>
			</div>
			{threads.map((item, i) => (
				<div key={i}>
					{item.id} {item.title}
				</div>
			))}
		</div>
	)
}