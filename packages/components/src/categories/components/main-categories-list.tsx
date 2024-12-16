import { Category } from './category.tsx';
import { getCategories } from '../queries/get-categories.ts';
import { Accordion } from '@repo/ui/src/components/accordion.tsx';

export const MainCategoriesList = async() => {
  const categories = await getCategories();
  
  if (!categories) return null;
  
  return (
    <Accordion
      type="multiple"
      defaultValue={[
        categories[0].title,
        categories[1].title,
        categories[2].title,
        categories[3].title,
        categories[4].title,
      ]}
    >
      <div className="flex flex-col gap-y-4 w-full">
        {categories.map(({ title, id, hasThreads }) =>
          <Category key={id} id={id} title={title} hasThreads={hasThreads} />
        )}
      </div>
    </Accordion>
  );
};