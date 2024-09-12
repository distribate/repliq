import { PageConventionProps } from '@repo/types/config/page-types.ts';
import { BlockWrapper } from '@repo/components/src/wrappers/block-wrapper.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';

export default async function CollectionPage({
  searchParams,
}: PageConventionProps) {
  console.log(searchParams);
  
  return (
    <div className="flex lg:flex-row flex-col w-full gap-2">
      <BlockWrapper className="flex flex-col gap-y-2 w-full !p-4">
        <Typography textSize="big" textColor="shark_white">
          Ваша коллекция
        </Typography>
      </BlockWrapper>
      {JSON.stringify(searchParams)}
    </div>
  );
}