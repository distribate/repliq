'use client';

import { X } from 'lucide-react';
import { useAuthBackgroundImage } from '../hooks/use-auth-bg-images.ts';

type AuthBackgroundImagesDeleteButtonProps = {
  imageName: string
}

export const AuthBackgroundImagesDeleteButton = ({
  imageName,
}: AuthBackgroundImagesDeleteButtonProps) => {
  const { deleteAuthImageFileMutation } = useAuthBackgroundImage();
  
  const handleDeleteAuthImage = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    deleteAuthImageFileMutation.mutate(imageName)
  }
  
  return (
    <div
      title="Удалить"
      onClick={handleDeleteAuthImage}
      className="opacity-0 group-hover:opacity-100 flex absolute top-2 right-1 duration-300 group-hover:duration-300"
    >
      <X size={18} className="text-red-500" />
    </div>
  );
};