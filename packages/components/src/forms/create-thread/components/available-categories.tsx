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
      <Skeleton className="h-6 rounded-md px-2 py-1 " />
      <Skeleton className="h-6 rounded-md px-2 py-1 " />
      <Skeleton className="h-6 rounded-md px-2 py-1 " />
      <Skeleton className="h-6 rounded-md px-2 py-1 " />
      <Skeleton className="h-6 rounded-md px-2 py-1 " />
    </>
  );
};

export const AvailableCategories = ({
  enabled,
}: AvailableCategoriesProps) => {
  const { data: availableCategories, isLoading } = availableCategoriesQuery(enabled);
  
  return (
    <SelectContent side="bottom" align="center" className="max-h-[300px] z-[5] overflow-y-scroll">
      <div className="flex flex-col gap-y-4 p-1">
        <Typography className="text-shark-300" textSize="large">
          Доступные категории
        </Typography>
        <div className="flex flex-col gap-y-2">
          {isLoading && <AvailableCategoriesSkeleton />}
          {!isLoading && (
            <>
              {availableCategories && availableCategories.map(category => (
                <SelectItem
                  withCheck={false}
                  key={category.id}
                  value={category.id.toString()}
                  className="flex w-full p-2 group"
                >
                  <Typography textColor="shark_white" textSize="medium">
                    {category.title}
                  </Typography>
                </SelectItem>
              ))}
              {!availableCategories &&
                <Typography textColor="shark_white" textSize="medium">Категорий нет.</Typography>}
            </>
          )}
        </div>
      </div>
    </SelectContent>
  );
};