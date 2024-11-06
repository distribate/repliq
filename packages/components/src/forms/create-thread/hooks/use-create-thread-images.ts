import { useCreateThread } from './use-create-thread.tsx';
import React, { ChangeEvent } from 'react';

export type CreateThreadImageControl = {
  type: 'add' | 'delete',
  e: React.MouseEvent<HTMLButtonElement, MouseEvent> | ChangeEvent<HTMLInputElement>,
  index?: number,
  resetField?: Function,
  setValue?: Function,
  images: File[] | null
}

export const useCreateThreadImages = () => {
  const { updateThreadFormMutation } = useCreateThread();
  
  const handleControlImage = (
    values: CreateThreadImageControl,
  ) => {
    const { e, index, type, images, resetField, setValue } = values;
    e.preventDefault();
    
    if (!images || images.length === 0) return;
    
    if (type === 'add') {
      const convertedFileList = images
      .map(file => URL.createObjectURL(file));
      
      updateThreadFormMutation.mutate({
        values: {
          images: convertedFileList,
        },
      });
      
    } else if (type === 'delete' && index !== undefined && resetField && setValue) {
      if (images.length <= 1) {
        resetField('images');
        
        updateThreadFormMutation.mutate({
          values: {
            images: [],
          },
        });
      } else {
        const updatedFormImages = images.filter((_, i) => i !== index);
        
        setValue("images", updatedFormImages)
        
        updateThreadFormMutation.mutate({
          values: {
            images: updatedFormImages
            .map(file => URL.createObjectURL(file)),
          },
        });
      }
    }
  };
  
  return { handleControlImage };
};