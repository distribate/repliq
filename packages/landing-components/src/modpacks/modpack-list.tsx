'use client';

import { modpacksQuery } from '@repo/lib/queries/modpacks-query.ts';
import { ModpackItem } from '../modpacks/modpack-item.tsx';
import { Typography } from '@repo/landing-ui/src/typography.tsx';
import { ModpackListSkeleton } from '../skeletons/modpack-list-skeleton.tsx';

const ModpackListNull = () => {
  return (
    <Typography text_color="adaptiveGray" className="text-2xl">
      Не удалось загрузить список модпаков. Попробуйте позже
    </Typography>
  );
};

export const ModpackList = () => {
  const { data: modpacks, isLoading, isError } = modpacksQuery();
  
  if (isLoading) return <ModpackListSkeleton />;
  if (isError) return <ModpackListNull />;
  if (!modpacks) return <ModpackListNull />;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 grid-rows-2">
      {modpacks.map(modpack => (
          <ModpackItem key={modpack.id} {...modpack} />
        ),
      )}
    </div>
  );
};