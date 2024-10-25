'use client';

import { useAuthBackgroundImage } from '../hooks/use-auth-bg-images.ts';
import { DeleteButton } from '@repo/ui/src/components/detele-button.tsx';

type AuthBackgroundImagesDeleteButtonProps = {
  imageName: string
}

export const AuthBackgroundImagesDeleteButton = ({
  imageName,
}: AuthBackgroundImagesDeleteButtonProps) => {
  const { deleteAuthImageFileMutation } = useAuthBackgroundImage();
  
  const handleDeleteAuthImage = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    deleteAuthImageFileMutation.mutate(imageName);
  };
  
  return (
    <DeleteButton
      variant="invisible"
      title="Удалить изображение"
      disabled={deleteAuthImageFileMutation.isPending}
      onClick={handleDeleteAuthImage}
    />
  );
};