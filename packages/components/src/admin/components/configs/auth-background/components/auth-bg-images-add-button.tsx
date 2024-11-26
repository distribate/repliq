"use client"

import { Plus } from 'lucide-react';
import { useAuthBackgroundImage } from '../hooks/use-auth-bg-images.ts';
import { ChangeEvent } from 'react';
import { GearLoader } from '@repo/ui/src/components/gear-loader.tsx';

export const AuthBackgroundImagesAddButton = () => {
  const { addAuthImageFileMutation } = useAuthBackgroundImage()
  
  const handleAuthImage = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;
    addAuthImageFileMutation.mutate(e.target.files)
  }
  
  return (
    <div
      className="flex items-center justify-center bg-transparent border hover:bg-secondary-color
      duration-300 border-shark-700 w-[116px] relative h-[116px] rounded-md"
    >
      {addAuthImageFileMutation.isPending ? (
        <GearLoader/>
      ) : (
        <Plus size={24} className="text-white" />
      )}
      <input
        title="Добавить изображение"
        type="file"
        accept="image/webp,image/png,image/jpeg,image/jpg"
        className="absolute opacity-0 cursor-pointer w-full h-full"
        multiple
        onChange={handleAuthImage}
      />
    </div>
  )
}