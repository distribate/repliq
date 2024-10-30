import { SelectContent, SelectItem } from '@repo/ui/src/components/select.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { availableCategoriesQuery } from '../queries/available-query.ts';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';

type AvailableCategoriesProps = {
  enabled: boolean
}

const AvailableCategoriesSkeleton = () => {
  return (
    <>
      <Skeleton className="h-6 rounded-md px-2 py-1 "/>
      <Skeleton className="h-6 rounded-md px-2 py-1 "/>
      <Skeleton className="h-6 rounded-md px-2 py-1 "/>
      <Skeleton className="h-6 rounded-md px-2 py-1 "/>
      <Skeleton className="h-6 rounded-md px-2 py-1 "/>
    </>
  )
}

export const AvailableCategories = ({
  enabled
}: AvailableCategoriesProps) => {
  const { data: availableCategories, isLoading } = availableCategoriesQuery(enabled);
  
  return (
    <SelectContent side="right" align="start" className="max-h-[300px] overflow-y-scroll">
      <div className="flex flex-col gap-y-4 p-1">
        <Typography className="text-shark-300" textSize="large">
          Доступные категории
        </Typography>
        <div className="flex flex-col gap-y-2">
          {isLoading ? <AvailableCategoriesSkeleton /> : (
            availableCategories ? (
              availableCategories.map(category => (
                <SelectItem
                  key={category.id}
                  value={category.id}
                  className="flex w-full p-2 bg-shark-800 rounded-md group"
                >
                  <Typography textColor="shark_white" textSize="medium">
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