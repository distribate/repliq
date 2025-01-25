import { DeleteButton } from "@repo/ui/src/components/detele-button.tsx";
import { useMinecraftItems } from "../../../../../forms/create-minecraft-items/hooks/use-minecraft-items.tsx";
import { DeleteMinecraftItem } from "../../../../../forms/create-minecraft-items/queries/delete-minecraft-item.ts";

export const MinecraftItemsDeleteButton = ({
  id,
  image,
}: DeleteMinecraftItem) => {
  const { deleteMinecraftItemMutation } = useMinecraftItems();

  const handleDeleteItem = () => {
    deleteMinecraftItemMutation.mutate({ image, id });
  };

  return (
    <DeleteButton
      variant="invisible"
      title="Удалить"
      onClick={handleDeleteItem}
      disabled={deleteMinecraftItemMutation.isPending}
    />
  );
};
