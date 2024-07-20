import { useQuery } from '@tanstack/react-query';
import { AvailableMinecraftItem, getAvailableMinecraftItems } from '@repo/lib/queries/get-available-minecraft-items.ts';

export const favoriteItemsQuery = () => {
  return useQuery<AvailableMinecraftItem[] | null, Error>({
    queryKey: [ 'ui', 'minecraft-items' ],
    queryFn: () => getAvailableMinecraftItems(),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};