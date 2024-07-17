import { SelectContent, SelectItem } from '@repo/ui/src/components/select.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { AvailableCategoriesSkeleton } from './available-categories-skeleton.tsx';
import { availableCategoriesQuery } from '../queries/available-query.ts';

type AvailableCategoriesProps = {
  categoriesEnabled: boolean
}

export const AvailableCategories = ({
  categoriesEnabled,
}: AvailableCategoriesProps) => {
  const {
    data: availableCategories,
    isLoading,
  } = availableCategoriesQuery({
    enabled: categoriesEnabled,
  });
  
  return (
    <SelectContent side="right" align="start" className="max-h-[300px] overflow-y-scroll">
      <div className="flex flex-col gap-y-4 p-1">
        <Typography className="text-shark-300" textSize="small">Доступные категории</Typography>
        <div className="flex flex-col gap-y-2">
          {isLoading ? <AvailableCategoriesSkeleton /> : (
            availableCategories ? (
              availableCategories.map(category => (
                <SelectItem
                  key={category.id}
                  value={category.id}
                  className="flex w-full p-2 bg-white/10 rounded-md group"
                >
                  <Typography className="group-hover:text-pink-500">
                    {category.title}
                  </Typography>
                </SelectItem>
              ))
            ) : <Typography>Категорий нет.</Typography>
          )}
        </div>
      </div>
    </SelectContent>
  );
};