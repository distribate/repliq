'use client';

import { ModpackItem } from '../modpacks/modpack-item.tsx';
import { Typography } from '@repo/landing-ui/src/typography.tsx';
import { Skeleton } from '@repo/landing-ui/src/skeleton.tsx';
import { useQuery } from '@tanstack/react-query';
import { forumLandingClient } from "@repo/shared/api/forum-client";

export const MODPACKS_QUERY_KEY = ["modpacks"]

const getModpacks = async () => {
  const res = await forumLandingClient["get-modpacks"].$get()

  const data = await res.json()

  if ("error" in data) {
    return null;
  }

  return data.data
}

const modpacksQuery = () => useQuery({
  queryKey: MODPACKS_QUERY_KEY,
  queryFn: () => getModpacks(),
  refetchOnWindowFocus: false,
  refetchOnMount: false
})

const ModpackListNull = () => {
  return (
    <Typography text_color="adaptiveGray" className="text-2xl">
      Не удалось загрузить список модпаков. Попробуйте позже
    </Typography>
  );
};

const ModpackListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 grid-rows-2">
      <Skeleton className="w-full h-80" />
      <Skeleton className="w-full h-80" />
      <Skeleton className="w-full h-80" />
      <Skeleton className="w-full h-80" />
    </div>
  );
};

export const ModpackList = () => {
  const { data: modpacks, isLoading, isError } = modpacksQuery();

  if (isLoading) return <ModpackListSkeleton />;

  if (isError) return <ModpackListNull />;

  if (!modpacks) return <ModpackListNull />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 grid-rows-2">
      {modpacks.map(modpack => <ModpackItem key={modpack.id} {...modpack} />)}
    </div>
  );
};