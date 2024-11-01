import { useMutation } from '@tanstack/react-query';
import { CreateMinecraftItem, createMinecraftItem } from '../queries/create-minecraft-item.ts';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { deleteMinecraftItem, DeleteMinecraftItem } from '../queries/delete-minecraft-item.ts';
import { encode } from 'base64-arraybuffer';
import { getArrayBuffer } from '@repo/lib/helpers/ger-array-buffer.ts';

export const MINECRAFT_CREATE_ITEM_MUTATION_KEY = [ 'minecraft-item-create' ];
export const MINECRAFT_DELETE_ITEM_MUTATION_KEY = [ 'minecraft-item-delete' ];

type CreateMinecraftItemMutation = {
  image: File
} & Pick<CreateMinecraftItem, 'title' | "description">

export const useMinecraftItems = () => {
  const { refresh } = useRouter();
  
  const createMinecraftItemMutation = useMutation({
    mutationKey: MINECRAFT_CREATE_ITEM_MUTATION_KEY,
    mutationFn: async(values: CreateMinecraftItemMutation) => {
      const base64ItemImage = await getArrayBuffer(values.image);
      const encodedImage = encode(base64ItemImage);
      
      return createMinecraftItem({
        ...values, image: encodedImage
      });
    },
    onSuccess: async(data, variables, context) => {
      if (!data) return toast.error('Произошла ошибка при создании предмета');
      
      toast.success('Предмет создан');
      
      return refresh();
    },
    onError: e => {
      throw new Error(e.message);
    },
  });
  
  const deleteMinecraftItemMutation = useMutation({
    mutationKey: MINECRAFT_DELETE_ITEM_MUTATION_KEY,
    mutationFn: async(values: DeleteMinecraftItem) => deleteMinecraftItem(values),
    onSuccess: async(data, variables, context) => {
      if (!data) return toast.error('Произошла ошибка при удалении предмета');
      
      return refresh();
    },
    onError: e => { throw new Error(e.message); },
  });
  
  return { createMinecraftItemMutation, deleteMinecraftItemMutation };
};