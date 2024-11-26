import { Category } from './category.tsx';
import { getCategories } from '../queries/get-categories.ts';
import { Accordion } from '@repo/ui/src/components/accordion.tsx';

export const MainCategoriesList = async() => {
  const categories = await getCategories();
  
  return (
    <Accordion
      type="multiple"
      defaultValue={[
        categories[0].title, categories[1].title,
        categories[2].title, categories[3].title,
        categories[4].title,
      ]}
    >
      <div className="flex flex-col gap-y-4 w-full">
        {categories.map(item => (
          <div
            key={item.id}
            className="flex gap-y-4 w-full py-4 flex-col rounded-lg px-4 bg-primary-color"
          >
            <Category {...item} />
          </div>
        ))}
      </div>
    </Accordion>
  );
};