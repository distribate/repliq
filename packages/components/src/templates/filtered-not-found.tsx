import { Typography } from '@repo/ui/src/components/typography.tsx';

type FilteredNotFoundProps = Partial<{
  value: string
}>

export const FilteredNotFound = ({
  value
}: FilteredNotFoundProps) => {
  
  if (!value) return;
  
  return (
    <Typography>
      Ничего не нашлось по запросу {`"${value}"`}
    </Typography>
  );
};