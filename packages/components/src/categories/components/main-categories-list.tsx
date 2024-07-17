import { CategoryBlock } from "./category-block.tsx";
import { getCategories } from "../queries/get-categories.ts";
import { Accordion } from "@repo/ui/src/components/accordion.tsx";
import { SectionGlobal } from '@repo/ui/src/components/section-global.tsx';

export const MainCategoriesList = async() => {
	const categories = await getCategories()
	
	return (
		<div className="flex flex-col w-full pr-4 gap-y-4 h-full">
			<Accordion
				type="multiple"
				defaultValue={[
					categories[0].title, categories[1].title,
					categories[2].title, categories[3].title,
					categories[4].title
				]}
			>
				<div className="flex flex-col gap-y-4 w-full">
					{categories.map((item, i) => (
						<SectionGlobal key={i} variant="section">
							<CategoryBlock id={item.id} title={item.title}/>
						</SectionGlobal>
					))}
				</div>
			</Accordion>
		</div>
	)
}