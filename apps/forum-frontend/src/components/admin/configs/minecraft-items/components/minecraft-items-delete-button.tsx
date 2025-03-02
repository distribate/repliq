import { DeleteButton } from "@repo/ui/src/components/detele-button.tsx";
import { useMinecraftItems } from "../../../../../forms/create-minecraft-items/hooks/use-minecraft-items.tsx";

export const MinecraftItemsDeleteButton = ({
  id,
  image,
}: {
  id: number,
  image: string
}) => {
  // const { deleteMinecraftItemMutation } = useMinecraftItems();

  const handleDeleteItem = () => {
    // deleteMinecraftItemMutation.mutate();
  };

  return (
    <DeleteButton
      variant="invisible"
      title="Удалить"
      onClick={handleDeleteItem}
      // disabled={deleteMinecraftItemMutation.isPending}
    />
  );
};
