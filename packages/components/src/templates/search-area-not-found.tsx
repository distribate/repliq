import { Typography } from "@repo/ui/src/components/typography.tsx";

type SearchAreaNotFoundProps = {
  searchValue: string | null;
};

export const SearchAreaNotFound = ({
  searchValue,
}: SearchAreaNotFoundProps) => {
  if (!searchValue) return null;

  return (
    <div className="flex flex-col gap-y-1">
      <Typography className="text-base font-medium text-shark-50">
        По запросу "{searchValue}" ничего не нашлось.
      </Typography>
    </div>
  );
};
