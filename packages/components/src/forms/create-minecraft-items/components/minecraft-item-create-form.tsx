import { useMinecraftItems } from '../hooks/use-minecraft-items.tsx';
import { Input } from '@repo/ui/src/components/input.tsx';
import { Button } from '@repo/ui/src/components/button.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { DialogClose } from '@repo/ui/src/components/dialog.tsx';
import { useEffect, ChangeEvent, useState } from 'react';
import Image from 'next/image';
import { Image as ImageIcon } from 'lucide-react';

type MinecraftItemValues = {
  title: string,
  image: File | null
  description: string
}

export const MinecraftItemCreateForm = () => {
  const [ tipShow, setTipShow ] = useState<boolean>(false);
  const { createMinecraftItemMutation } = useMinecraftItems();
  const [ previewImage, setPreviewImage ] = useState<string | null>(null);
  const [ itemValues, setItemValues ] = useState<MinecraftItemValues>({
    title: '', image: null, description: '',
  });
  
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>, field: keyof typeof itemValues,
  ) => {
    setItemValues(prev => ({ ...prev, [field]: e.target.value }));
  }
  
  useEffect(() => {
    if (itemValues.title.length >= 3 && !itemValues.image) setTipShow(true);
  }, [ itemValues.title ]);
  
  useEffect(() => {
    if (itemValues.image) setTipShow(false);
  }, [itemValues.image]);
  
  const handleCreateItem = () => {
    if (!itemValues.image || !itemValues.image) return;
    
    return createMinecraftItemMutation.mutate({
      title: itemValues.title, description: itemValues.description, image: itemValues.image,
    });
  };
  
  const handleClose = () => {
    setItemValues({ title: '', image: null, description: '' });
  };
  
  const handleAuthImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const image = e.target.files[0];
    
    const previewImage = URL.createObjectURL(image);
    setPreviewImage(previewImage);
    setItemValues(prev => ({ ...prev, image: image }));
  };
  
  const isDisabled = createMinecraftItemMutation.isPending
    || !itemValues.title
    || !itemValues.image;
  
  return (
    <>
      <div className="flex items-start w-full gap-2 overflow-hidden">
        <div className="flex flex-col gap-4 w-fit grow">
          <Input
            maxLength={64}
            placeholder="Название"
            roundedType="default"
            value={itemValues.title}
            onChange={e => handleInputChange(e, 'title')}
          />
          {tipShow && (
            <Typography textColor="gray" textSize="medium">
              Не забудьте загрузить изображение для предмета!
            </Typography>
          )}
        </div>
        {previewImage ? (
          <Image
            src={previewImage}
            alt={itemValues.title}
            width={128}
            height={128}
            className="rounded-md"
            title={itemValues.title}
          />
        ) : (
          <div
            className="flex relative hover-select-effect justify-center items-center w-[128px] h-[128px] rounded-md"
          >
            <ImageIcon size={32} className="text-shark-300" />
            <input
              title="Добавить изображение"
              type="file"
              accept="image/webp,image/png,image/jpeg,image/jpg"
              className="absolute opacity-0 cursor-pointer w-full h-full"
              onChange={handleAuthImage}
            />
          </div>
        )}
      </div>
      <div className="flex items-center pb-2 gap-2 *:w-full w-full">
        <Button
          onClick={handleCreateItem}
          variant="positive"
          className="w-full"
          disabled={isDisabled}
        >
          <Typography>Создать</Typography>
        </Button>
        <DialogClose onClick={handleClose}>
          <Button variant="negative" className="w-full">
            <Typography>Отмена</Typography>
          </Button>
        </DialogClose>
      </div>
    </>
  );
};