import { useQuery } from "@tanstack/react-query";
import { getAvailableMinecraftItems } from "@repo/lib/queries/get-available-minecraft-items.ts";
import { MinecraftItemEntity } from "@repo/types/entities/entities-type.ts";

export const favoriteItemsQuery = () => {
  return useQuery<MinecraftItemEntity[] | null, Error>({
    queryKey: ["ui", "minecraft-items"],
    queryFn: () => getAvailableMinecraftItems(),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
