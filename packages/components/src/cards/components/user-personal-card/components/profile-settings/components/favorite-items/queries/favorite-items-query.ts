import { useQuery } from "@tanstack/react-query";
import { MinecraftItemEntity } from "@repo/types/entities/entities-type.ts";

export const favoriteItemsQuery = () => {
  return useQuery<MinecraftItemEntity[] | null, Error>({
    queryKey: ["ui", "minecraft-items"],
    queryFn: () => null,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
